import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return (
      <Uttak
        uttak={deepCopyProps.uttak}
        behandling={deepCopyProps.behandling}
        inntektsgraderinger={deepCopyProps.inntektsgraderinger}
        perioderTilVurdering={deepCopyProps.perioderTilVurdering}
        aksjonspunkter={deepCopyProps.aksjonspunkter}
        hentBehandling={props.hentBehandling}
        erOverstyrer={props.erOverstyrer}
        readOnly={props.isReadOnly}
      />
    );
  };

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
      inntektsgraderinger: pleiepengerInntektsgradering?.perioder,
      arbeidsgiverOpplysningerPerId,
      alleKodeverk,
      relevanteAksjonspunkter: this.getAksjonspunktKoder(),
      uttak,
    };
  };
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
