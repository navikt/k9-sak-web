import React from 'react';
import type { Decorator } from '@storybook/react';

const withMaxWidth =
  (maxWidth: string | number): Decorator =>
  Story => {
    const maxWidthStr = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    return (
      <div style={{ maxWidth: maxWidthStr }}>
        {' '}
        <Story />{' '}
      </div>
    );
  };

export default withMaxWidth;
