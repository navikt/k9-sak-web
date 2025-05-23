import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';

import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';
import findStatusForVedtak from '../vedtakStatusUtlederPleiepengerSluttfase';

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
    PleiepengerSluttfaseBehandlingApiKeys.TILBAKEKREVINGVALG,
    PleiepengerSluttfaseBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING,
    PleiepengerSluttfaseBehandlingApiKeys.MEDLEMSKAP,
    PleiepengerSluttfaseBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV,
    PleiepengerSluttfaseBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV,
    PleiepengerSluttfaseBehandlingApiKeys.DOKUMENTDATA_HENTE,
    PleiepengerSluttfaseBehandlingApiKeys.FRITEKSTDOKUMENTER,
    PleiepengerSluttfaseBehandlingApiKeys.OVERLAPPENDE_YTELSER,
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
    fagsak,
  }: {
    fagsak: Fagsak;
    previewCallback;
    hentFritekstbrevHtmlCallback;
    rettigheter;
    aksjonspunkter;
    vilkar;
    simuleringResultat;
    beregningsgrunnlag;
    arbeidsgiverOpplysningerPerId;
    lagreDokumentdata;
  }) => ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    ytelseTypeKode: fagsak.sakstype,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
  });
}

class VedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakProsessStegPanelDef;
