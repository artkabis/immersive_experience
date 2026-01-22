import React, { useState, useEffect } from 'react';

const SectionIndicator = ({ totalSections = 11, onSectionClick = null }) => {
  const [activeSection, setActiveSection] = useState(0);

  const sectionNames = [
    'Genèse',
    'Nébuleuse',
    'Plasma',
    'Forge',
    'Fractale',
    'Astéroïdes',
    'Océan',
    'Aurore',
    'Vortex',
    'Glitch',
    'Singularité'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const newSection = Math.min(
        Math.floor(scrollPercent * totalSections),
        totalSections - 1
      );
      setActiveSection(newSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const handleDotClick = (index) => {
    if (onSectionClick) {
      onSectionClick(index);
    } else {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = index * (scrollHeight / (totalSections - 1));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="section-indicator" id="sectionIndicator">
      {Array.from({ length: totalSections }).map((_, i) => (
        <div
          key={i}
          className={`indicator-dot ${i === activeSection ? 'active' : ''}`}
          data-section={i}
          data-name={sectionNames[i]}
          onClick={() => handleDotClick(i)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDotClick(i);
            }
          }}
        />
      ))}
    </div>
  );
};

export default SectionIndicator;
