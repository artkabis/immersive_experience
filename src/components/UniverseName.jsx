import React from 'react';

const UniverseName = ({ name = 'GENÈSE', color = '#00ffc8' }) => {
  return (
    <div
      className="universe-name"
      id="universeName"
      style={{ color: color }}
    >
      {name}
    </div>
  );
};

export default UniverseName;
