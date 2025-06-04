import { addYearsToDate, getHumanReadablePeriodString } from '@fpsak-frontend/utils';
import { Alert, Box } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
import VurderingContext from '../../context/VurderingContext';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';
import ManglerGyldigSignaturMelding from '../mangler-gyldig-signatur-melding/ManglerGyldigSignaturMelding';

interface VurderingsoversiktMessagesProps {
  vurderingsoversikt: Vurderingsoversikt | null;
  harGyldigSignatur: boolean;
}

const VurderingsoversiktMessages = ({
  vurderingsoversikt,
  harGyldigSignatur,
}: VurderingsoversiktMessagesProps): JSX.Element => {
  const { vurderingstype } = React.useContext(VurderingContext);
  const vurderingsnavn =
    vurderingstype === Vurderingstype.TO_OMSORGSPERSONER ? 'to omsorgspersoner' : 'tilsyn og pleie';

  if (!harGyldigSignatur) {
    return (
      <Box marginBlock="0 6">
        <ManglerGyldigSignaturMelding>
          Du kan ikke vurdere behov for
          {` ${vurderingsnavn} `}
          før søker har sendt inn legeerklæring fra sykehus/spesialisthelsetjenesten.
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

  if (vurderingsoversikt && vurderingsoversikt.harPerioderSomSkalVurderes() === true) {
    const barnetsAttenårsdag = vurderingsoversikt.harPerioderDerPleietrengendeErOver18år
      ? addYearsToDate(vurderingsoversikt.pleietrengendesFødselsdato, 18)
      : null;

    return (
      <>
        <Box marginBlock="0 6">
          <Alert size="small" variant="warning">
            {`Vurder behov for ${vurderingsnavn} for ${getHumanReadablePeriodString(
              vurderingsoversikt.resterendeVurderingsperioder,
            )}.`}
          </Alert>
        </Box>
        {vurderingsoversikt.harPerioderDerPleietrengendeErOver18år && (
          <Box marginBlock="0 6">
            <Alert size="small" variant="warning">
              Barnet er 18 år {barnetsAttenårsdag}. Du må gjøre en egen vurdering etter § 9-10, tredje ledd fra datoen
              barnet fyller 18 år.
            </Alert>
          </Box>
        )}
      </>
    );
    /*
        Please note:
        So long as this doesnt actually do anything upon the click-event, it should be commented out.
        overlappendeVurderingsperioder && overlappendeVurderingsperioder.length > 0 && (
            <Box marginBlock="4 0">
            <OverlappendeSøknadsperiodePanel
            onProgressButtonClick={() => console.log('does something')}
            overlappendeVurderingsperioder={overlappendeVurderingsperioder}
            />
            </Box>)
            */
  }
  return <></>;
};

export default VurderingsoversiktMessages;
