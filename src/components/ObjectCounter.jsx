import React from 'react';

const ObjectCounter = ({ count = 0 }) => {
  return (
    <div className="object-counter">
      MATIÈRE COSMIQUE: <span id="objectCount">{count}</span>
    </div>
  );
};

export default ObjectCounter;
