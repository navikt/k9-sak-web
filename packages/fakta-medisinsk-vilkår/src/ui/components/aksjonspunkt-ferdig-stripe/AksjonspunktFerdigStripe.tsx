import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { Alert, Button } from '@navikt/ds-react';
import * as React from 'react';
import FagsakYtelseType from '../../../constants/FagsakYtelseType';
import ContainerContext from '../../context/ContainerContext';

const AksjonspunktFerdigStripe = (): JSX.Element => {
  const { onFinished } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { fagsakYtelseType } = React.useContext(ContainerContext);
  const erPleiepengerSluttfaseFagsak = fagsakYtelseType === FagsakYtelseType.PLEIEPENGER_SLUTTFASE;

  return (
    <Box marginBottom={Margin.medium}>
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
