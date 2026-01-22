import React from 'react';

const Card = ({
  symbol = '✧',
  title = '',
  description = '',
  children = null
}) => {
  return (
    <div className="card">
      {symbol && <span className="cosmic-symbol">{symbol}</span>}
      {title && <h1>{title}</h1>}
      {children}
      {description && <p>{description}</p>}
    </div>
  );
};

export default Card;
