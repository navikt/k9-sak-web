import React from 'react';

import { ArrowBox } from '@k9-sak-web/shared-components';

export default {
  title: 'sharedComponents/ArrowBox',
  component: ArrowBox,
};

export const medPilPåToppen = () => (
  <div style={{ width: '200px' }}>
    <ArrowBox>Dette er en tekst</ArrowBox>
  </div>
);
