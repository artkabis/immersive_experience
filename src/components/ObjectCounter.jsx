import React, { useState, useCallback, useEffect } from 'react';

const ObjectCounter = ({ count = 0 }) => {
  const [objectCount, setObjectCount] = useState(count);

  const updateObjectCount = useCallback((newCount) => {
    setObjectCount(newCount);
  }, []);

  // Expose update function to window for external access
  useEffect(() => {
    window.updateObjectCount = updateObjectCount;
    return () => {
      delete window.updateObjectCount;
    };
  }, [updateObjectCount]);

  return (
    <div className="object-counter">
      MATIÈRE COSMIQUE: <span id="objectCount">{objectCount}</span>
    </div>
  );
};

export default ObjectCounter;
