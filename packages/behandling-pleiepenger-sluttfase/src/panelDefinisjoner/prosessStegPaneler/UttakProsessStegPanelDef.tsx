import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import React from 'react';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import AntallDagerLivetsSluttfaseIndex from '@k9-sak-web/prosess-uttak-antall-dager-sluttfase';
import Uttak from '../../components/Uttak';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = ({
    behandling,
    uttaksperioder,
    utsattePerioder,
    kvoteInfo,
    arbeidsgiverOpplysningerPerId,
    aksjonspunkter,
    erFagytelsetypeLivetsSluttfase,
  }) => (
    <>
      <AntallDagerLivetsSluttfaseIndex kvoteInfo={kvoteInfo} />
      <Uttak
        uuid={behandling.uuid}
        uttaksperioder={uttaksperioder}
        utsattePerioder={utsattePerioder}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        aksjonspunkter={aksjonspunkter}
        erFagytelsetypeLivetsSluttfase={erFagytelsetypeLivetsSluttfase}
      />
    </>
  );

  getAksjonspunktKoder = () => [aksjonspunktCodes.VENT_ANNEN_PSB_SAK];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = props => {
    const { uttak } = props;
    if (
      !uttak ||
      !uttak.uttaksplan ||
      !uttak.uttaksplan.perioder ||
      (uttak.uttaksplan.perioder && Object.keys(uttak.uttaksplan.perioder).length === 0)
    ) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    const uttaksperiodeKeys = Object.keys(uttak.uttaksplan.perioder);

    if (uttaksperiodeKeys.every(key => uttak.uttaksplan.perioder[key].utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      return vilkarUtfallType.IKKE_OPPFYLT;
    }

    return vilkarUtfallType.OPPFYLT;
  };

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.ARBEIDSFORHOLD];

  getData = ({ uttak, arbeidsgiverOpplysningerPerId, fagsak }) => ({
    uttaksperioder: uttak?.uttaksplan?.perioder,
    utsattePerioder: uttak?.utsattePerioder,
    kvoteInfo: uttak?.kvoteInfo,
    arbeidsgiverOpplysningerPerId,
    erFagytelsetypeLivetsSluttfase: fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER_SLUTTFASE,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
