import React from 'react';
import { Tag } from '@navikt/ds-react';

interface OwnProps {
  children: React.ReactNode;
}

const FraSoeknad = ({ children }: OwnProps) => (
  <div>
    <span style={{ marginRight: '0.5rem' }}>{children}</span>
    <Tag size="small" variant="info">
      Fra søknad
    </Tag>
  </div>
);

export default FraSoeknad;
