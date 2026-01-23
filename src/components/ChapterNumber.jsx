import React from 'react';

const ChapterNumber = ({ number = 1 }) => {
  const formattedNum = String(number).padStart(2, '0');

  return (
    <div className="chapter-number" id="chapterNumber">
      {formattedNum}
    </div>
  );
};

export default ChapterNumber;
