import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { FrisinnBehandlingApiKeys } from '../../data/frisinnBehandlingApi';
import findStatusForVedtak from '../vedtakStatusUtlederFrisinn';

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
    FrisinnBehandlingApiKeys.TILBAKEKREVINGVALG,
    FrisinnBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING,
    FrisinnBehandlingApiKeys.VEDTAK_VARSEL,
    FrisinnBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV,
  ];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg }) =>
    findStatusForVedtak(vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat);

  getData = ({
    previewCallback,
    rettigheter,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
  }) => ({
    previewCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag: beregningsgrunnlag ? [beregningsgrunnlag[0]] : [], // FRISINN skal alltid vise ett beregningsgrunnlag
    ytelseTypeKode: fagsakYtelsesType.FRISINN,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
  });
}

class VedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakProsessStegPanelDef;
