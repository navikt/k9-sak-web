import React from 'react';
import { Alert } from '@navikt/ds-react';

const LagreVurderingFeiletMelding = (): JSX.Element => (
  <Alert size="small" variant="error">
    Noe gikk galt ved lagring av vurderingen, vennligst prøv igjen senere.
  </Alert>
);

export default LagreVurderingFeiletMelding;
