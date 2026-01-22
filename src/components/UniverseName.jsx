import React, { useState, useEffect } from 'react';

const UniverseName = ({ universeColor = '#00ffc8' }) => {
  const [currentName, setCurrentName] = useState('GENÈSE');

  const universeNames = [
    'GENÈSE',
    'NÉBULEUSE',
    'PLASMA',
    'FORGE STELLAIRE',
    'FRACTALE',
    'ASTÉROÏDES',
    'OCÉAN COSMIQUE',
    'AURORA',
    'VORTEX',
    'GLITCH',
    'SINGULARITÉ'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const sectionIndex = Math.min(
        Math.floor(scrollPercent * universeNames.length),
        universeNames.length - 1
      );
      setCurrentName(universeNames[sectionIndex]);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="universe-name"
      id="universeName"
      style={{ color: universeColor }}
    >
      {currentName}
    </div>
  );
};

export default UniverseName;
