import React from 'react';
import NotatISakIndex from '@k9-sak-web/sak-notat';

export default {
  title: 'sak/sak-notat',
  component: NotatISakIndex,
};

export const visNotatISakPanel = () => (
  <div
    style={{
      width: '700px',
      margin: '50px',
      padding: '20px',
      backgroundColor: 'white',
    }}
  >
    <NotatISakIndex />
  </div>
);
