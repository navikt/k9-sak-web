import React from 'react';

const withMaxWidth = (maxWidth: string | number) => Story => {
  const maxWidthStr = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  return (
    <div style={{ maxWidth: maxWidthStr }}>
      {' '}
      <Story />{' '}
    </div>
  );
};

export default withMaxWidth;
