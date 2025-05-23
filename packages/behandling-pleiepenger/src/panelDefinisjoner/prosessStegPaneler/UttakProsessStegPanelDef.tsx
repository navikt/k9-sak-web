import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import Uttak from '../../components/Uttak';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = ({
    behandling,
    uttaksperioder,
    inntektsgraderinger,
    perioderTilVurdering,
    utsattePerioder,
    arbeidsgiverOpplysningerPerId,
    aksjonspunkter,
    alleKodeverk,
    submitCallback,
    lagreOverstyringUttak,
    virkningsdatoUttakNyeRegler,
    relevanteAksjonspunkter,
    erOverstyrer,
    isReadOnly,
  }) => (
    <Uttak
      uuid={behandling.uuid}
      behandling={behandling}
      uttaksperioder={uttaksperioder}
      inntektsgraderinger={inntektsgraderinger}
      perioderTilVurdering={perioderTilVurdering}
      utsattePerioder={utsattePerioder}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      lagreOverstyringUttak={lagreOverstyringUttak}
      virkningsdatoUttakNyeRegler={virkningsdatoUttakNyeRegler}
      relevanteAksjonspunkter={relevanteAksjonspunkter}
      erOverstyrer={erOverstyrer}
      readOnly={isReadOnly}
    />
  );

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
    aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
    aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
    aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE,
  ];

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

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getData = ({ uttak, arbeidsgiverOpplysningerPerId, alleKodeverk, pleiepengerInntektsgradering }) => {
    return {
      uttaksperioder: uttak?.uttaksplan != null ? uttak?.uttaksplan?.perioder : uttak?.simulertUttaksplan?.perioder,
      inntektsgraderinger: pleiepengerInntektsgradering?.perioder,
      perioderTilVurdering: uttak?.perioderTilVurdering,
      utsattePerioder: uttak?.utsattePerioder,
      virkningsdatoUttakNyeRegler: uttak?.virkningsdatoUttakNyeRegler,
      arbeidsgiverOpplysningerPerId,
      alleKodeverk,
      relevanteAksjonspunkter: this.getAksjonspunktKoder(),
    };
  };
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
