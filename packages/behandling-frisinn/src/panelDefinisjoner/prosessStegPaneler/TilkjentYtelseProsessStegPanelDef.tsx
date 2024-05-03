import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import TilkjentYtelseProsessIndex from '@k9-sak-web/prosess-tilkjent-ytelse';

const harKunAvslåtteUttak = beregningsresultatUtbetaling => {
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => [
    ...andeler.flatMap(({ uttak }) => [...uttak.flatMap(({ utfall }) => utfall)]),
  ]);
  // TODO Burde bruka kodeverk-konstant (ikkje hardkode 'INNVILGET')
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <TilkjentYtelseProsessIndex {...props} />;

  getAksjonspunktKoder = () => [];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ beregningsresultatUtbetalt }) => {
    if (
      !beregningsresultatUtbetalt ||
      !beregningsresultatUtbetalt.perioder ||
      beregningsresultatUtbetalt.perioder.length === 0
    ) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    if (harKunAvslåtteUttak(beregningsresultatUtbetalt)) {
      return vilkarUtfallType.IKKE_OPPFYLT;
    }
    return vilkarUtfallType.OPPFYLT;
  };

  getData = ({ fagsak, beregningsresultatUtbetalt, personopplysninger, arbeidsgiverOpplysningerPerId }) => ({
    fagsak,
    beregningsresultat: beregningsresultatUtbetalt,
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
