import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';
import findStatusForVedtak from '../vedtakStatusUtlederOpplaeringspenger';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <VedtakProsessIndex {...props} {...deepCopyProps} />;
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    aksjonspunktCodes.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK,
    aksjonspunktCodes.VURDERE_DOKUMENT,
    aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
    aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    aksjonspunktCodes.SJEKK_TILBAKEKREVING,
  ];

  getEndepunkter = () => [
    OpplaeringspengerBehandlingApiKeys.TILBAKEKREVINGVALG,
    OpplaeringspengerBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING,
    OpplaeringspengerBehandlingApiKeys.MEDLEMSKAP,
    OpplaeringspengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV,
    OpplaeringspengerBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV,
    OpplaeringspengerBehandlingApiKeys.DOKUMENTDATA_HENTE,
    OpplaeringspengerBehandlingApiKeys.FRITEKSTDOKUMENTER,
    OpplaeringspengerBehandlingApiKeys.OVERLAPPENDE_YTELSER,
  ];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg }) =>
    findStatusForVedtak(vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat);

  getData = ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    rettigheter,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
  }) => ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    ytelseTypeKode: fagsakYtelseType.PLEIEPENGER,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
  });

  getId = () => 'VEDTAK';
}

class VedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakProsessStegPanelDef;
