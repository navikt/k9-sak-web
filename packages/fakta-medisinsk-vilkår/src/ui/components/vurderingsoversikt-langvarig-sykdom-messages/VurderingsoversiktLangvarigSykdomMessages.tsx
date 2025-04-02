import { getHumanReadablePeriodString } from '@fpsak-frontend/utils';
import { Alert } from '@navikt/ds-react';
import { Box } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';

interface VurderingsoversiktLangvarigSykdomMessagesProps {
  vurderingsoversikt: Vurderingsoversikt;
}

const VurderingsoversiktLangvarigSykdomMessages = ({
  vurderingsoversikt,
}: VurderingsoversiktLangvarigSykdomMessagesProps): JSX.Element => {
  if (vurderingsoversikt.harIngenPerioderÅVise()) {
    return (
      <Box marginBlock="0 6">
        <IngenPerioderÅVurdereMelding />
      </Box>
    );
  }

  if (vurderingsoversikt.harPerioderSomSkalVurderes() === true) {
    return (
      <Box marginBlock="0 6">
        <Alert size="small" variant="warning">
          {`Vurder om pleietrengende har langvarig sykdom i søknadsperioden ${getHumanReadablePeriodString(
            vurderingsoversikt.resterendeVurderingsperioder,
          )}.`}
        </Alert>
      </Box>
    );
  }
  return null;
};

export default VurderingsoversiktLangvarigSykdomMessages;
