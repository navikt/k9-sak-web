import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import findStatusForVedtak from '../vedtakStatusUtlederFrisinn';
import frisinnBehandlingApi from '../../data/frisinnBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    aksjonspunktCodes.VURDERE_DOKUMENT,
    aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
    aksjonspunktCodes.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
  ];

  getEndepunkter = () => [
    frisinnBehandlingApi.TILBAKEKREVINGVALG,
    frisinnBehandlingApi.SEND_VARSEL_OM_REVURDERING,
    frisinnBehandlingApi.VEDTAK_VARSEL,
    frisinnBehandlingApi.TILGJENGELIGE_VEDTAKSBREV,
  ];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ vilkar, aksjonspunkter, behandling, aksjonspunkterForSteg }) =>
    findStatusForVedtak(vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat);

  getData = ({ previewCallback, rettigheter, aksjonspunkter, vilkar, simuleringResultat, beregningsgrunnlag }) => ({
    previewCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    ytelseTypeKode: fagsakYtelseType.FRISINN,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
  });
}

class VedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakProsessStegPanelDef;
