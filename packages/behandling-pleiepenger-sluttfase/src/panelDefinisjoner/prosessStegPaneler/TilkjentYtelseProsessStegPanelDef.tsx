import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

const harKunAvslåtteUttak = beregningsresultatUtbetaling => {
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => [
    ...andeler.flatMap(({ uttak }) => [...uttak.flatMap(({ utfall }) => utfall)]),
  ]);
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <TilkjentYtelseProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_TILBAKETREKK];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ beregningsresultatUtbetaling }) => {
    if (!beregningsresultatUtbetaling) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    if (harKunAvslåtteUttak(beregningsresultatUtbetaling)) {
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
