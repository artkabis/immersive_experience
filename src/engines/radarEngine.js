// ============================================
// COSMIC RADAR ENGINE
// ============================================

class CosmicRadar {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 150;
        this.height = 150;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.radius = 70;
        this.sweepAngle = 0;
        this.detectedObjects = [];
        this.trails = []; // Traînées des objets
        this.color = '#00ffc8';
    }

    setColor(color) {
        this.color = color;
    }

    update(bodies, currentTime) {
        // Mise à jour de l'angle de balayage
        this.sweepAngle += 0.03;
        if (this.sweepAngle > Math.PI * 2) {
            this.sweepAngle -= Math.PI * 2;
        }

        // Convertir les positions 3D en positions radar
        this.detectedObjects = bodies.map(b => {
            const pos = b.body.translation();
            // Normaliser les positions (supposons que la scène va de -20 à 20)
            const rx = (pos.x / 25) * this.radius;
            const rz = (pos.z / 25) * this.radius;
            const distance = Math.sqrt(rx * rx + rz * rz);
            const angle = Math.atan2(rz, rx);

            return {
                x: this.centerX + rx,
                y: this.centerY + rz,
                distance: distance,
                angle: angle,
                altitude: pos.y,
                isNew: (currentTime - b.birthTime) < 500 // Nouveau si créé il y a moins de 500ms
            };
        });

        // Ajouter des traînées pour les objets détectés par le balayage
        this.detectedObjects.forEach(obj => {
            // Vérifier si l'objet est dans le secteur du balayage
            let objAngle = obj.angle;
            if (objAngle < 0) objAngle += Math.PI * 2;

            const sweepNormalized = this.sweepAngle % (Math.PI * 2);
            const angleDiff = Math.abs(objAngle - sweepNormalized);

            if (angleDiff < 0.1 || angleDiff > Math.PI * 2 - 0.1) {
                // L'objet vient d'être "scanné"
                this.trails.push({
                    x: obj.x,
                    y: obj.y,
                    opacity: 1,
                    isNew: obj.isNew
                });
            }
        });

        // Faire décroître les traînées
        this.trails = this.trails.filter(trail => {
            trail.opacity -= 0.015;
            return trail.opacity > 0;
        });

        // Mettre à jour les stats
        const avgDist = this.detectedObjects.length > 0
            ? Math.round(this.detectedObjects.reduce((sum, o) => sum + o.distance, 0) / this.detectedObjects.length)
            : '--';
        document.getElementById('radarStats').textContent =
            `OBJETS: ${this.detectedObjects.length} | DIST: ${avgDist}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Cercles concentriques
        this.ctx.strokeStyle = this.color;
        this.ctx.globalAlpha = 0.2;
        for (let r = 20; r <= this.radius; r += 20) {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Lignes de quadrant
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - this.radius);
        this.ctx.lineTo(this.centerX, this.centerY + this.radius);
        this.ctx.moveTo(this.centerX - this.radius, this.centerY);
        this.ctx.lineTo(this.centerX + this.radius, this.centerY);
        this.ctx.stroke();

        // Balayage (effet de radar)
        const gradient = this.ctx.createConicalGradient
            ? this.ctx.createConicalGradient(this.sweepAngle, this.centerX, this.centerY)
            : null;

        // Dessiner le secteur de balayage
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.arc(this.centerX, this.centerY, this.radius, this.sweepAngle - 0.5, this.sweepAngle);
        this.ctx.closePath();
        this.ctx.fill();

        // Ligne de balayage
        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(
            this.centerX + Math.cos(this.sweepAngle) * this.radius,
            this.centerY + Math.sin(this.sweepAngle) * this.radius
        );
        this.ctx.stroke();
        this.ctx.lineWidth = 1;

        // Dessiner les traînées (effet persistance)
        this.trails.forEach(trail => {
            this.ctx.globalAlpha = trail.opacity * 0.6;
            this.ctx.fillStyle = trail.isNew ? '#ffff00' : this.color;
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, trail.isNew ? 4 : 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Dessiner les objets actuels (points brillants)
        this.detectedObjects.forEach(obj => {
            // Point principal
            this.ctx.globalAlpha = 0.9;
            this.ctx.fillStyle = obj.isNew ? '#ffff00' : this.color;
            this.ctx.beginPath();
            this.ctx.arc(obj.x, obj.y, obj.isNew ? 5 : 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Halo pour les nouveaux objets
            if (obj.isNew) {
                this.ctx.globalAlpha = 0.3;
                this.ctx.beginPath();
                this.ctx.arc(obj.x, obj.y, 8, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Indicateur d'altitude (ligne verticale)
            if (obj.altitude > 5) {
                this.ctx.globalAlpha = 0.4;
                this.ctx.strokeStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.moveTo(obj.x, obj.y);
                this.ctx.lineTo(obj.x, obj.y - Math.min(obj.altitude / 2, 15));
                this.ctx.stroke();
            }
        });

        // Centre du radar
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.globalAlpha = 1;
    }
}

export default CosmicRadar;
