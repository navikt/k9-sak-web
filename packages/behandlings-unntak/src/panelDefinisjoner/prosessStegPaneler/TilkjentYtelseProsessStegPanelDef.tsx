import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

const harKunAvslåtteUttak = beregningsresultatUtbetaling => {
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => {
    return [
      ...andeler.flatMap(({ uttak }) => {
        return [...uttak.flatMap(({ utfall }) => utfall)];
      }),
    ];
  });
  // TODO Burde bruka kodeverk-konstant (ikkje hardkode 'INNVILGET')
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <TilkjentYtelseProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.MANUELL_TILKJENT_YTELSE];

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

  getData = ({ fagsak, beregningsresultatUtbetalt, personopplysninger }) => {
    return {
      fagsak,
      personopplysninger,
      beregningsresultat: beregningsresultatUtbetalt,
    };
  };
}

class TilkjentYtelseProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.TILKJENT_YTELSE;

  getTekstKode = () => 'Behandlingspunkt.TilkjentYtelse';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default TilkjentYtelseProsessStegPanelDef;
