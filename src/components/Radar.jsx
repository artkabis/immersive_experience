import React, { useEffect, useRef, useState } from 'react';

const Radar = ({ isVisible = false, universeColor = '#00ffc8' }) => {
  const canvasRef = useRef(null);
  const [radarData, setRadarData] = useState({
    objectCount: 0,
    avgDistance: '--'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 150;
    const height = 150;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 70;

    let sweepAngle = 0;
    let trails = [];

    const updateRadar = () => {
      sweepAngle += 0.03;
      if (sweepAngle > Math.PI * 2) {
        sweepAngle -= Math.PI * 2;
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw concentric circles
      ctx.strokeStyle = universeColor;
      ctx.globalAlpha = 0.2;
      for (let r = 20; r <= radius; r += 20) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw quadrant lines
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.stroke();

      // Draw sweep sector
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = universeColor;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle - 0.5, sweepAngle);
      ctx.closePath();
      ctx.fill();

      // Draw sweep line
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = universeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * radius,
        centerY + Math.sin(sweepAngle) * radius
      );
      ctx.stroke();

      // Draw trails
      trails.forEach((trail) => {
        ctx.globalAlpha = trail.opacity * 0.6;
        ctx.fillStyle = trail.isNew ? '#ffff00' : universeColor;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.isNew ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update trails opacity
      trails = trails.filter((trail) => {
        trail.opacity -= 0.015;
        return trail.opacity > 0;
      });

      // Draw center point
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;

      if (isVisible) {
        requestAnimationFrame(updateRadar);
      }
    };

    if (isVisible) {
      updateRadar();
    }
  }, [isVisible, universeColor]);

  return (
    <div
      className={`radar-container ${isVisible ? 'visible' : ''}`}
      id="radarContainer"
    >
      <div className="radar-stats" id="radarStats">
        OBJETS: {radarData.objectCount} | DIST: {radarData.avgDistance}
      </div>
      <div className="radar-frame"></div>
      <canvas
        ref={canvasRef}
        className="radar-canvas"
        id="radarCanvas"
        width="150"
        height="150"
      />
      <div className="radar-label">DÉTECTION COSMIQUE</div>
    </div>
  );
};

export default Radar;
