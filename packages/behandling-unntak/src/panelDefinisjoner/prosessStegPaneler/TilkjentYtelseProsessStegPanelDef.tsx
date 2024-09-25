import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { UnntakBehandlingApiKeys } from '../../data/unntakBehandlingApi';

const harIngenAndeler = perioder => {
  const alleAndeler = perioder.flatMap(({ andeler }) => [...andeler]);
  return alleAndeler.length === 0;
};

const harKunAvslåtteUttak = beregningsresultatUtbetaling => {
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => [
    ...andeler.flatMap(({ uttak }) => [...uttak.flatMap(({ utfall }) => utfall)]),
  ]);
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <TilkjentYtelseProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.MANUELL_TILKJENT_YTELSE];

  getOverstyrVisningAvKomponent = () => true;

  getEndepunkter = () => [UnntakBehandlingApiKeys.ARBEIDSFORHOLD];

  getOverstyrtStatus = ({ beregningsresultatUtbetaling }) => {
    const manglerBeregningsresultatUtbetaling =
      !beregningsresultatUtbetaling ||
      !beregningsresultatUtbetaling.perioder ||
      beregningsresultatUtbetaling.perioder.length === 0;
    if (manglerBeregningsresultatUtbetaling) {
      return vilkarUtfallType.IKKE_VURDERT;
    }

    if (harIngenAndeler(beregningsresultatUtbetaling.perioder) || harKunAvslåtteUttak(beregningsresultatUtbetaling)) {
      return vilkarUtfallType.IKKE_OPPFYLT;
    }
    return vilkarUtfallType.OPPFYLT;
  };

  getData = ({ fagsak, beregningsresultatUtbetaling, personopplysninger, arbeidsgiverOpplysningerPerId }) => ({
    fagsak,
    beregningsresultat: beregningsresultatUtbetaling,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
  });
}

class TilkjentYtelseProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.TILKJENT_YTELSE;

  getTekstKode = () => 'Behandlingspunkt.TilkjentYtelse';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default TilkjentYtelseProsessStegPanelDef;
