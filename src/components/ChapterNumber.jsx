import React, { useState, useEffect } from 'react';

const ChapterNumber = () => {
  const [chapterNum, setChapterNum] = useState('01');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const sectionIndex = Math.min(
        Math.floor(scrollPercent * 11),
        10
      );
      const formattedNum = String(sectionIndex + 1).padStart(2, '0');
      setChapterNum(formattedNum);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="chapter-number" id="chapterNumber">
      {chapterNum}
    </div>
  );
};

export default ChapterNumber;
