import React from 'react';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div
      className="progress-bar"
      id="progressBar"
      style={{ width: progress + '%' }}
    />
  );
};

export default ProgressBar;
