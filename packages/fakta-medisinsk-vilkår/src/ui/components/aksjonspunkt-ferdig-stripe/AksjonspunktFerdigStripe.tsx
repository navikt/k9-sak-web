import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Alert, Button } from '@navikt/ds-react';
import { Box } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import ContainerContext from '../../context/ContainerContext';

import type { JSX } from 'react';

const AksjonspunktFerdigStripe = (): JSX.Element => {
  const { onFinished } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { fagsakYtelseType } = React.useContext(ContainerContext);
  const erPleiepengerSluttfaseFagsak = fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE;

  return (
    <Box marginBlock="0 4">
      <Alert size="small" variant="info">
        {erPleiepengerSluttfaseFagsak && <>Vilkåret er ferdig vurdert og du kan gå videre i behandlingen.</>}
        {!erPleiepengerSluttfaseFagsak && <>Sykdom er ferdig vurdert og du kan gå videre i behandlingen.</>}
        <Button
          style={{ marginLeft: '2rem' }}
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={() => {
            setIsSubmitting(true);
            setTimeout(() => setIsSubmitting(false), 10 * 1000);
            onFinished();
          }}
          size="small"
        >
          Fortsett
        </Button>
      </Alert>
    </Box>
  );
};

export default AksjonspunktFerdigStripe;
