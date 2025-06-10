import { getHumanReadablePeriodString } from '@fpsak-frontend/utils';
import { Alert, Box } from '@navikt/ds-react';
import { type JSX } from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';
import ManglerGyldigSignaturMelding from '../mangler-gyldig-signatur-melding/ManglerGyldigSignaturMelding';

interface VurderingsoversiktSluttfaseMessagesProps {
  vurderingsoversikt: Vurderingsoversikt | null;
  harGyldigSignatur: boolean;
}

const VurderingsoversiktSluttfaseMessages = ({
  vurderingsoversikt,
  harGyldigSignatur,
}: VurderingsoversiktSluttfaseMessagesProps): JSX.Element => {
  if (!harGyldigSignatur) {
    return (
      <Box marginBlock="0 6">
        <ManglerGyldigSignaturMelding>
          Du kan ikke vurdere behov for om pleietrengende er i livets sluttfase før søker har sendt inn legeerklæring
          fra lege eller helseinstitusjon.
        </ManglerGyldigSignaturMelding>
      </Box>
    );
  }

  if (vurderingsoversikt && vurderingsoversikt.harIngenPerioderÅVise()) {
    return (
      <Box marginBlock="0 6">
        <IngenPerioderÅVurdereMelding />
      </Box>
    );
  }

  if (vurderingsoversikt?.harPerioderSomSkalVurderes() === true) {
    return (
      <Box marginBlock="0 6">
        <Alert size="small" variant="warning">
          {`Vurder om pleietrengende er i livets sluttfase i søknadsperioden ${getHumanReadablePeriodString(
            vurderingsoversikt.resterendeVurderingsperioder,
          )}.`}
        </Alert>
      </Box>
    );
  }
  return <></>;
};

export default VurderingsoversiktSluttfaseMessages;
