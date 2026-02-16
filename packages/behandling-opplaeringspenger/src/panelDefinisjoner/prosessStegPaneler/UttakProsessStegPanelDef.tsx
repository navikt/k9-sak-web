import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return (
      <Uttak
        uttak={deepCopyProps.uttak}
        behandling={deepCopyProps.behandling}
        aksjonspunkter={deepCopyProps.aksjonspunkter}
        relevanteAksjonspunkter={deepCopyProps.relevanteAksjonspunkter}
        hentBehandling={props.hentBehandling}
        erOverstyrer={props.erOverstyrer}
        readOnly={props.isReadOnly}
      />
    );
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
    aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
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

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getData = ({ uttak }) => ({ uttak, relevanteAksjonspunkter: this.getAksjonspunktKoder() });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
