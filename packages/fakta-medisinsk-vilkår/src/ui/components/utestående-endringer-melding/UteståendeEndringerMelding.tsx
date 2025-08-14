import { Alert, BodyShort, Box, Button } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import ContainerContext from '../../context/ContainerContext';

const UteståendeEndringerMelding = (): JSX.Element => {
  const { onFinished } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <Box.New marginBlock="0 4">
      <Alert size="small" variant="warning">
        <BodyShort size="small">
          OBS! Det er gjort endringer i sykdomssteget. For at endringene som er gjort skal bli tatt med i behandlingen,
          trykk på Fortsett.
        </BodyShort>
        <Box.New marginBlock="2 0">
          <Button
            size="small"
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={() => {
              setIsSubmitting(true);
              setTimeout(() => setIsSubmitting(false), 10 * 1000);
              onFinished();
            }}
          >
            Fortsett
          </Button>
        </Box.New>
      </Alert>
    </Box.New>
  );
};

export default UteståendeEndringerMelding;
