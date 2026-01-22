import React, { useState, useEffect, useCallback } from 'react';

const ModeIndicator = () => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showModeIndicator = useCallback((text, duration = 1500) => {
    setMessage(text);
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  // Expose function to window for external access
  useEffect(() => {
    window.showModeIndicator = showModeIndicator;
    return () => {
      delete window.showModeIndicator;
    };
  }, [showModeIndicator]);

  return (
    <div
      className={`mode-indicator ${isVisible ? 'visible' : ''}`}
      id="modeIndicator"
    >
      {message}
    </div>
  );
};

export default ModeIndicator;
