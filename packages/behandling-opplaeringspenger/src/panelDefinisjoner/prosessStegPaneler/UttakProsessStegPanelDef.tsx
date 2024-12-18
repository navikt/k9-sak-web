import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import Uttak from '../../components/Uttak';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = ({
    behandling,
    uttaksperioder,
    utsattePerioder,
    arbeidsgiverOpplysningerPerId,
    aksjonspunkter,
    alleKodeverk,
    submitCallback,
    virkningsdatoUttakNyeRegler,
    isReadOnly,
  }) => (
    <Uttak
      uuid={behandling.uuid}
      uttaksperioder={uttaksperioder}
      utsattePerioder={utsattePerioder}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      virkningsdatoUttakNyeRegler={virkningsdatoUttakNyeRegler}
      readOnly={isReadOnly}
    />
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

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getData = ({ uttak, arbeidsgiverOpplysningerPerId, alleKodeverk }) => ({
    uttaksperioder: uttak?.uttaksplan != null ? uttak?.uttaksplan?.perioder : uttak?.simulertUttaksplan?.perioder,
    utsattePerioder: uttak?.utsattePerioder,
    virkningsdatoUttakNyeRegler: uttak?.virkningsdatoUttakNyeRegler,
    arbeidsgiverOpplysningerPerId,
    alleKodeverk,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
