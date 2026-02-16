import { Alert } from '@navikt/ds-react';
import type React from 'react';
import type { JSX } from 'react';

interface ManglerGyldigSignaturMeldingProps {
  children: React.ReactNode;
}

const ManglerGyldigSignaturMelding = ({ children }: ManglerGyldigSignaturMeldingProps): JSX.Element => (
  <Alert size="small" variant="info">
    {children}
  </Alert>
);

export default ManglerGyldigSignaturMelding;
