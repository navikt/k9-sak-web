import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import { Alert, BodyShort, Box, Button } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import ContainerContext from '../../context/ContainerContext';

const UteståendeEndringerMelding = (): JSX.Element => {
  const { onFinished } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <ContentMaxWidth>
      <Box marginBlock="space-0 space-16">
        <Alert size="small" variant="warning">
          <BodyShort size="small">
            OBS! Det er gjort endringer i sykdomssteget. For at endringene som er gjort skal bli tatt med i
            behandlingen, trykk på Fortsett.
          </BodyShort>
          <Box marginBlock="space-4 space-0">
            <Button
              data-color="info"
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
    </ContentMaxWidth>
  );
};

export default UteståendeEndringerMelding;
