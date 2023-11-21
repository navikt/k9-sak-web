import React from 'react';
import { Alert } from '@navikt/ds-react';

interface ManglerGyldigSignaturMeldingProps {
  children: React.ReactNode;
}

const ManglerGyldigSignaturMelding = ({ children }: ManglerGyldigSignaturMeldingProps): JSX.Element => (
  <Alert size="small" variant="info">
    {children}
  </Alert>
);

export default ManglerGyldigSignaturMelding;
