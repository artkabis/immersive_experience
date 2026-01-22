import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const trailsContainerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const trailsRef = useRef([]);

  useEffect(() => {
    // Initialize trails
    const trails = [];
    for (let i = 0; i < 8; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = ((1 - i / 8) * 0.5).toString();
      if (trailsContainerRef.current) {
        trailsContainerRef.current.appendChild(trail);
      }
      trails.push({ el: trail, x: 0, y: 0 });
    }
    trailsRef.current = trails;

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      setMousePos({ x, y });

      if (cursorRef.current) {
        cursorRef.current.style.left = x + 'px';
        cursorRef.current.style.top = y + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateTrails = () => {
      let prevX = mousePos.x;
      let prevY = mousePos.y;

      trailsRef.current.forEach((trail, i) => {
        const speed = 0.15 - i * 0.01;
        trail.x += (prevX - trail.x) * speed;
        trail.y += (prevY - trail.y) * speed;
        trail.el.style.left = trail.x + 'px';
        trail.el.style.top = trail.y + 'px';
        prevX = trail.x;
        prevY = trail.y;
      });

      requestAnimationFrame(updateTrails);
    };

    const animationId = requestAnimationFrame(updateTrails);
    return () => cancelAnimationFrame(animationId);
  }, [mousePos]);

  const handleMouseDown = (e) => {
    if (cursorRef.current) {
      cursorRef.current.classList.add('clicking');
    }
  };

  const handleMouseUp = () => {
    if (cursorRef.current) {
      cursorRef.current.classList.remove('clicking');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor" ref={cursorRef}></div>
      <div id="cursorTrails" ref={trailsContainerRef}></div>
    </>
  );
};

export default CustomCursor;
