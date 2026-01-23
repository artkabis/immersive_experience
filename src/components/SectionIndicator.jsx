import React from 'react';

const SectionIndicator = ({ currentSection = 0, totalSections = 11, onSectionClick = null }) => {
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
          className={`indicator-dot ${i === currentSection ? 'active' : ''}`}
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
