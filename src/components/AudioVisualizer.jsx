import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ isPlaying = false, analyser = null }) => {
  const containerRef = useRef(null);
  const barsRef = useRef([]);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    // Initialize bars
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      barsRef.current = [];

      for (let i = 0; i < 24; i++) {
        const bar = document.createElement('div');
        bar.className = 'audio-bar';
        containerRef.current.appendChild(bar);
        barsRef.current.push(bar);
      }
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || !analyser) {
      return;
    }

    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    const updateVisualization = () => {
      if (!analyser || !dataArrayRef.current) return;

      analyser.getByteFrequencyData(dataArrayRef.current);

      barsRef.current.forEach((bar, i) => {
        const value = dataArrayRef.current[i] || 0;
        const height = Math.max(3, (value / 255) * 25);
        bar.style.height = height + 'px';
      });

      if (isPlaying) {
        requestAnimationFrame(updateVisualization);
      }
    };

    const animationId = requestAnimationFrame(updateVisualization);

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, analyser]);

  return (
    <div
      className={`audio-visualizer ${isPlaying ? 'playing' : ''}`}
      id="audioVisualizer"
      ref={containerRef}
    />
  );
};

export default AudioVisualizer;
