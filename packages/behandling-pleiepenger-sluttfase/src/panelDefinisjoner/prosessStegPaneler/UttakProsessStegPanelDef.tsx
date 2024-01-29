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
    alleKodeverk,
    erFagytelsetypeLivetsSluttfase,
    submitCallback,
    virkningsdatoUttakNyeRegler,
  }) => (
    <>
      <AntallDagerLivetsSluttfaseIndex kvoteInfo={kvoteInfo} />
      <Uttak
        uuid={behandling.uuid}
        uttaksperioder={uttaksperioder}
        utsattePerioder={utsattePerioder}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        aksjonspunkter={aksjonspunkter}
        erFagytelsetypeLivetsSluttfase={erFagytelsetypeLivetsSluttfase}
        submitCallback={submitCallback}
        virkningsdatoUttakNyeRegler={virkningsdatoUttakNyeRegler}
      />
    </>
  );

  getAksjonspunktKoder = () => [aksjonspunktCodes.VENT_ANNEN_PSB_SAK, aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK];

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

  getData = ({ uttak, arbeidsgiverOpplysningerPerId, fagsak, alleKodeverk }) => ({
    uttaksperioder: uttak?.uttaksplan != null ? uttak?.uttaksplan?.perioder : uttak?.simulertUttaksplan?.perioder,
    utsattePerioder: uttak?.utsattePerioder,
    kvoteInfo: uttak?.uttaksplan?.kvoteInfo,
    virkningsdatoUttakNyeRegler: uttak?.virkningsdatoUttakNyeRegler,
    arbeidsgiverOpplysningerPerId,
    erFagytelsetypeLivetsSluttfase: fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER_SLUTTFASE,
    alleKodeverk,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
