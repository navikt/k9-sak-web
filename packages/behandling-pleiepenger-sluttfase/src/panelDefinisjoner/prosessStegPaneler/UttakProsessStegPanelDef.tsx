import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import AntallDagerLivetsSluttfaseIndex from '@k9-sak-web/prosess-uttak-antall-dager-sluttfase';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    const { kvoteInfo, hentBehandling, erOverstyrer, isReadOnly } = props;
    const { uttak, behandling, aksjonspunkter, relevanteAksjonspunkter } = deepCopyProps;
    return (
      <>
        <AntallDagerLivetsSluttfaseIndex kvoteInfo={kvoteInfo} />
        <Uttak
          uttak={uttak}
          behandling={behandling}
          aksjonspunkter={aksjonspunkter}
          relevanteAksjonspunkter={relevanteAksjonspunkter}
          hentBehandling={hentBehandling}
          erOverstyrer={erOverstyrer}
          readOnly={isReadOnly}
        />
      </>
    );
  };

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

  getData = ({ uttak }) => ({
    uttak,
    kvoteInfo: uttak?.uttaksplan?.kvoteInfo,
    relevanteAksjonspunkter: this.getAksjonspunktKoder(),
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
