import { Alert } from '@navikt/ds-react';

const AvslåttAvInnleggelsesperiodeMelding = () => (
  <Alert size="small" variant="warning">
    Hele eller deler av perioden er avslått som følge av innleggelse. Vurderingen som ligger til grunn blir dermed ikke
    brukt for disse dagene.
  </Alert>
);

export default AvslåttAvInnleggelsesperiodeMelding;

