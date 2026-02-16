import { Alert } from '@navikt/ds-react';
import React, { type JSX } from 'react';

const DekketAvInnleggelsesperiodeMelding = (): JSX.Element => (
  <Alert size="small" variant="info">
    Hele eller deler av perioden er oppfylt som følge av innleggelse. Vurderingen som ligger til grunn blir dermed ikke
    brukt for disse dagene.
  </Alert>
);

export default DekketAvInnleggelsesperiodeMelding;
