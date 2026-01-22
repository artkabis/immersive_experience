// ============================================
// COSMIC OBJECT CREATORS
// ============================================
// Array of creation functions for different universes (0-10)

import * as THREE from 'three';

const objectCreators = [
    // 0. Genèse - Poussière cosmique
    () => {
        const group = new THREE.Group();
        for (let i = 0; i < 12; i++) {
            const geo = new THREE.SphereGeometry(0.05 + Math.random() * 0.12, 8, 8);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x00ffc8, emissive: 0x00ffc8, emissiveIntensity: 0.8,
                transparent: true, opacity: 0.9
            });
            const p = new THREE.Mesh(geo, mat);
            p.position.set((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8);
            group.add(p);
        }
        return group;
    },
    // 1. Nébuleuse
    () => {
        const group = new THREE.Group();
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0x8a2be2, emissive: 0x4b0082, emissiveIntensity: 1, transparent: true, opacity: 0.7 })
        );
        group.add(core);
        for (let i = 0; i < 15; i++) {
            const cloud = new THREE.Mesh(
                new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 8),
                new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.8, 0.5), emissive: 0x4b0082, emissiveIntensity: 0.5, transparent: true, opacity: 0.5 })
            );
            const angle = Math.random() * Math.PI * 2;
            cloud.position.set(Math.cos(angle) * (0.3 + Math.random() * 0.5), (Math.random() - 0.5) * 0.6, Math.sin(angle) * (0.3 + Math.random() * 0.5));
            group.add(cloud);
        }
        return group;
    },
    // 2. Plasma
    () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0xff0080, emissive: 0xff4400, emissiveIntensity: 1.2, metalness: 0.3, roughness: 0.7 })
        ));
        for (let i = 0; i < 5; i++) {
            const filament = new THREE.Mesh(
                new THREE.TorusGeometry(0.55 + i * 0.08, 0.015, 8, 32),
                new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.7 - i * 0.1 })
            );
            filament.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            group.add(filament);
        }
        return group;
    },
    // 3. Étoile
    () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.4, 2),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd700, emissiveIntensity: 2 })
        ));
        for (let i = 0; i < 8; i++) {
            const ray = new THREE.Mesh(
                new THREE.ConeGeometry(0.06, 0.7, 4),
                new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.85 })
            );
            const theta = (i / 8) * Math.PI * 2;
            ray.position.set(Math.cos(theta) * 0.45, 0, Math.sin(theta) * 0.45);
            ray.rotation.z = -Math.PI / 2;
            ray.rotation.y = -theta;
            group.add(ray);
        }
        group.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.65, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.25, side: THREE.BackSide })
        ));
        return group;
    },
    // 4. Cristal
    () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(
            new THREE.OctahedronGeometry(0.5, 0),
            new THREE.MeshStandardMaterial({ color: 0xffc800, emissive: 0xffa000, emissiveIntensity: 0.6, metalness: 1, roughness: 0, transparent: true, opacity: 0.9 })
        ));
        const inner = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.3, 0),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, wireframe: true })
        );
        inner.rotation.y = Math.PI / 4;
        group.add(inner);
        return group;
    },
    // 5. Astéroïde
    () => {
        const group = new THREE.Group();
        const geo = new THREE.DodecahedronGeometry(0.5, 1);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const noise = 0.75 + Math.random() * 0.5;
            pos.setXYZ(i, pos.getX(i) * noise, pos.getY(i) * noise, pos.getZ(i) * noise);
        }
        geo.computeVertexNormals();
        group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x8b7765, roughness: 1, metalness: 0.2, flatShading: true })));
        return group;
    },
    // 6. Méduse
    () => {
        const group = new THREE.Group();
        const dome = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshStandardMaterial({ color: 0x00c8ff, emissive: 0x0066ff, emissiveIntensity: 0.6, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
        );
        dome.rotation.x = Math.PI;
        group.add(dome);
        for (let i = 0; i < 8; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3((Math.random() - 0.5) * 0.3, -0.3, (Math.random() - 0.5) * 0.3),
                new THREE.Vector3((Math.random() - 0.5) * 0.5, -0.7, (Math.random() - 0.5) * 0.5),
                new THREE.Vector3((Math.random() - 0.5) * 0.4, -1.1, (Math.random() - 0.5) * 0.4)
            ]);
            const tentacle = new THREE.Mesh(
                new THREE.TubeGeometry(curve, 20, 0.02, 8, false),
                new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.65 })
            );
            const angle = (i / 8) * Math.PI * 2;
            tentacle.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
            group.add(tentacle);
        }
        return group;
    },
    // 7. Aurora
    () => {
        const group = new THREE.Group();
        const points = [];
        for (let i = 0; i < 20; i++) {
            points.push(new THREE.Vector3(Math.sin(i * 0.5) * 0.3, i * 0.1 - 1, Math.cos(i * 0.5) * 0.3));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        group.add(new THREE.Mesh(
            new THREE.TubeGeometry(curve, 50, 0.07, 8, false),
            new THREE.MeshBasicMaterial({ color: 0x00ff7f, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
        ));
        for (let i = 0; i < 12; i++) {
            const p = new THREE.Mesh(
                new THREE.SphereGeometry(0.035, 8, 8),
                new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.3 + Math.random() * 0.4, 1, 0.6), transparent: true, opacity: 0.85 })
            );
            p.position.copy(curve.getPoint(Math.random()));
            group.add(p);
        }
        return group;
    },
    // 8. Vortex
    () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.28, 0.08, 64, 8, 2, 3),
            new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 0.9, metalness: 0.5, roughness: 0.3 })
        ));
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.45 + i * 0.12, 0.012, 8, 32),
                new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(i * 0.3, 1, 0.5), transparent: true, opacity: 0.55 - i * 0.1 })
            );
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
        }
        return group;
    },
    // 9. Glitch
    () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), new THREE.MeshNormalMaterial({ flatShading: true })));
        for (let i = 0; i < 6; i++) {
            const frag = new THREE.Mesh(
                new THREE.BoxGeometry(0.18, 0.18, 0.18),
                new THREE.MeshBasicMaterial({ color: [0xff0000, 0x00ff00, 0x0000ff][i % 3], transparent: true, opacity: 0.6, wireframe: Math.random() > 0.5 })
            );
            frag.position.set((Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7);
            group.add(frag);
        }
        return group;
    },
    // 10. Singularité
    () => {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 })));
        const disk = new THREE.Mesh(
            new THREE.TorusGeometry(0.55, 0.12, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
        );
        disk.rotation.x = Math.PI / 2;
        group.add(disk);
        group.add(new THREE.Mesh(
            new THREE.SphereGeometry(0.75, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.BackSide, blending: THREE.AdditiveBlending })
        ));
        return group;
    }
];

export default objectCreators;
