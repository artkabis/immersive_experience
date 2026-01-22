import React, { useState, useCallback } from 'react';

const ControlPanel = ({
  onGravityToggle = null,
  onAttractToggle = null,
  onTimeWarpToggle = null,
  onRadarToggle = null,
  onAudioToggle = null,
  onClear = null
}) => {
  const [gravityActive, setGravityActive] = useState(false);
  const [attractActive, setAttractActive] = useState(false);
  const [timeWarpActive, setTimeWarpActive] = useState(false);
  const [radarActive, setRadarActive] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  const handleGravityClick = useCallback(() => {
    const newState = !gravityActive;
    setGravityActive(newState);
    if (onGravityToggle) onGravityToggle(newState);
  }, [gravityActive, onGravityToggle]);

  const handleAttractClick = useCallback(() => {
    const newState = !attractActive;
    setAttractActive(newState);
    if (onAttractToggle) onAttractToggle(newState);
  }, [attractActive, onAttractToggle]);

  const handleTimeWarpClick = useCallback(() => {
    const newState = !timeWarpActive;
    setTimeWarpActive(newState);
    if (onTimeWarpToggle) onTimeWarpToggle(newState);
  }, [timeWarpActive, onTimeWarpToggle]);

  const handleRadarClick = useCallback(() => {
    const newState = !radarActive;
    setRadarActive(newState);
    if (onRadarToggle) onRadarToggle(newState);
  }, [radarActive, onRadarToggle]);

  const handleAudioClick = useCallback(() => {
    const newState = !audioActive;
    setAudioActive(newState);
    if (onAudioToggle) onAudioToggle(newState);
  }, [audioActive, onAudioToggle]);

  const handleClearClick = useCallback(() => {
    if (onClear) onClear();
  }, [onClear]);

  return (
    <div className="control-panel">
      <button
        className={`control-btn ${gravityActive ? 'active' : ''}`}
        id="btnGravity"
        data-tooltip="Inverser Gravité (G)"
        onClick={handleGravityClick}
        title="Inverser Gravité (G)"
      >
        ⇅
      </button>
      <button
        className={`control-btn ${attractActive ? 'active' : ''}`}
        id="btnAttract"
        data-tooltip="Mode Attraction (A)"
        onClick={handleAttractClick}
        title="Mode Attraction (A)"
      >
        ◎
      </button>
      <button
        className={`control-btn ${timeWarpActive ? 'active' : ''}`}
        id="btnTimeWarp"
        data-tooltip="Ralenti Temporel (T)"
        onClick={handleTimeWarpClick}
        title="Ralenti Temporel (T)"
      >
        ◷
      </button>
      <button
        className={`control-btn ${radarActive ? 'active' : ''}`}
        id="btnRadar"
        data-tooltip="Radar (R)"
        onClick={handleRadarClick}
        title="Radar (R)"
      >
        ◉
      </button>
      <button
        className={`control-btn ${audioActive ? 'active' : ''}`}
        id="btnAudio"
        data-tooltip="Audio Ambiant (M)"
        onClick={handleAudioClick}
        title="Audio Ambiant (M)"
      >
        ♫
      </button>
      <button
        className="control-btn"
        id="btnClear"
        data-tooltip="Effacer Tout (C)"
        onClick={handleClearClick}
        title="Effacer Tout (C)"
      >
        ✕
      </button>
    </div>
  );
};

export default ControlPanel;
