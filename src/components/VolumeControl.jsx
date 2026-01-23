import React, { useState, useCallback } from 'react';

const VolumeControl = ({ initialVolume = 30, onVolumeChange = null, visible = false }) => {
  const [volume, setVolume] = useState(initialVolume);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  }, [onVolumeChange]);

  return (
    <div
      className={`volume-control ${visible ? 'visible' : ''}`}
      id="volumeControl"
    >
      <label>🔊</label>
      <input
        type="range"
        className="volume-slider"
        id="volumeSlider"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
      />
      <span id="volumeValue">{Math.round(volume)}%</span>
    </div>
  );
};

export default VolumeControl;
