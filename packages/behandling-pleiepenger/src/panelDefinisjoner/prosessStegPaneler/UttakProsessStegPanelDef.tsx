import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import React from 'react';
import Uttak from '../../components/Uttak';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = ({ behandling, uttaksperioder, arbeidsgiverOpplysningerPerId }) => (
    <Uttak
      uuid={behandling.uuid}
      uttaksperioder={uttaksperioder?.perioder}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />
  );

  getAksjonspunktKoder = () => [];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = props => {
    const { uttak } = props;
    if (!uttak || (uttak?.perioder && Object.keys(uttak.perioder).length === 0)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    const uttaksperiodeKeys = Object.keys(uttak.perioder);

    if (uttaksperiodeKeys.every(key => uttak.perioder[key].utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      return vilkarUtfallType.IKKE_OPPFYLT;
    }

    return vilkarUtfallType.OPPFYLT;
  };

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getData = ({ uttak, arbeidsgiverOpplysningerPerId }) => ({
    uttaksperioder: uttak,
    arbeidsgiverOpplysningerPerId,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
