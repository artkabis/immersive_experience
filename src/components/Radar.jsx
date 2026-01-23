import React from 'react';

const Radar = ({ visible = false }) => {
  // This component just provides the canvas element and DOM structure.
  // The actual radar drawing is handled by the CosmicRadar engine
  // which is called from App.jsx's animation loop.

  return (
    <div
      className={`radar-container ${visible ? 'visible' : ''}`}
      id="radarContainer"
    >
      <div className="radar-stats" id="radarStats">
        OBJETS: 0 | DIST: --
      </div>
      <div className="radar-frame"></div>
      <canvas
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
