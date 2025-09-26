import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import { Alert, BodyShort, Box, Button } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import ContainerContext from '../../context/ContainerContext';

const UteståendeEndringerMelding = (): JSX.Element => {
  const { onFinished } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <ContentMaxWidth>
      <Box.New marginBlock="0 4">
        <Alert size="small" variant="warning">
          <BodyShort size="small">
            OBS! Det er gjort endringer i sykdomssteget. For at endringene som er gjort skal bli tatt med i
            behandlingen, trykk på Fortsett.
          </BodyShort>
          <Box.New marginBlock="1 0">
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
          </Box.New>
        </Alert>
      </Box.New>
    </ContentMaxWidth>
  );
};

export default UteståendeEndringerMelding;
