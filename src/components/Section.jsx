import React from 'react';
import Card from './Card';

const Section = ({
  universe = 'genesis',
  children = null,
  title = '',
  description = '',
  symbol = '✧',
  justifyContent = 'flex-start'
}) => {
  return (
    <section
      className="section"
      data-universe={universe}
      style={{ justifyContent }}
    >
      {children ? (
        children
      ) : (
        <Card title={title} description={description} symbol={symbol} />
      )}
    </section>
  );
};

export default Section;
