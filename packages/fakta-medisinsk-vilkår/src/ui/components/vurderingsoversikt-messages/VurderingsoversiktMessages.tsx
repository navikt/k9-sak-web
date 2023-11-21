import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { getHumanReadablePeriodString } from '@navikt/k9-fe-period-utils';
import { Alert } from '@navikt/ds-react';
import React from 'react';
import { addYearsToDate } from '@navikt/k9-fe-date-utils';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';
import ManglerGyldigSignaturMelding from '../mangler-gyldig-signatur-melding/ManglerGyldigSignaturMelding';
import VurderingContext from '../../context/VurderingContext';

interface VurderingsoversiktMessagesProps {
  vurderingsoversikt: Vurderingsoversikt;
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
      <Box marginBottom={Margin.large}>
        <ManglerGyldigSignaturMelding>
          Du kan ikke vurdere behov for
          {` ${vurderingsnavn} `}
          før søker har sendt inn legeerklæring fra sykehus/spesialisthelsetjenesten.
        </ManglerGyldigSignaturMelding>
      </Box>
    );
  }

  if (vurderingsoversikt.harIngenPerioderÅVise()) {
    return (
      <Box marginBottom={Margin.large}>
        <IngenPerioderÅVurdereMelding />
      </Box>
    );
  }

  if (vurderingsoversikt.harPerioderSomSkalVurderes() === true) {
    const barnetsAttenårsdag = vurderingsoversikt.harPerioderDerPleietrengendeErOver18år
      ? addYearsToDate(vurderingsoversikt.pleietrengendesFødselsdato, 18)
      : null;

    return (
      <>
        <Box marginBottom={Margin.large}>
          <Alert size="small" variant="warning">
            {`Vurder behov for ${vurderingsnavn} for ${getHumanReadablePeriodString(
              vurderingsoversikt.resterendeVurderingsperioder,
            )}.`}
          </Alert>
        </Box>
        {vurderingsoversikt.harPerioderDerPleietrengendeErOver18år && (
          <Box marginBottom={Margin.large}>
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
            <Box marginTop={Margin.medium}>
            <OverlappendeSøknadsperiodePanel
            onProgressButtonClick={() => console.log('does something')}
            overlappendeVurderingsperioder={overlappendeVurderingsperioder}
            />
            </Box>)
            */
  }
  return null;
};

export default VurderingsoversiktMessages;
