import { Alert, BodyShort, Button } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import ContainerContext from '../../context/ContainerContext';

const UteståendeEndringerMelding = (): JSX.Element => {
  const { onFinished } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <Box marginBottom={Margin.medium}>
      <Alert size="small" variant="warning">
        <BodyShort size="small">
          OBS! Det er gjort endringer i sykdomssteget. For at endringene som er gjort skal bli tatt med i behandlingen,
          trykk på Fortsett.
        </BodyShort>
        <Box marginTop={Margin.small}>
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
        </Box>
      </Alert>
    </Box>
  );
};

export default UteståendeEndringerMelding;
