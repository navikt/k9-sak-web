import redusertUtbetalingArsak from "@fpsak-frontend/prosess-vedtak/src/kodeverk/redusertUtbetalingArsak";
import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { dokumentdatatype, featureToggle, prosessStegCodes } from '@k9-sak-web/konstanter';
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

  getEndepunkter = featureToggles => {
    const endepunkterUtenDd = [
      frisinnBehandlingApi.TILBAKEKREVINGVALG,
      frisinnBehandlingApi.SEND_VARSEL_OM_REVURDERING,
      frisinnBehandlingApi.VEDTAK_VARSEL,
      frisinnBehandlingApi.TILGJENGELIGE_VEDTAKSBREV,
    ];
    const endepunkterMedDd = endepunkterUtenDd.concat([frisinnBehandlingApi.DOKUMENTDATA_HENTE]);
    return featureToggles?.[featureToggle.AKTIVER_DOKUMENTDATA] ? endepunkterMedDd : endepunkterUtenDd;
  };

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
    featureToggles,
  }) => ({
    previewCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    beregningsgrunnlag,
    ytelseTypeKode: fagsakYtelseType.FRISINN,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    lagreArsakerTilRedusertUtbetaling: (values, dispatch) => {
      if (featureToggles?.[featureToggle.AKTIVER_DOKUMENTDATA] && frisinnBehandlingApi.DOKUMENTDATA_LAGRE) {
        const arsaker = Object.values(redusertUtbetalingArsak).filter(a => values[a]);
        dispatch(frisinnBehandlingApi.DOKUMENTDATA_LAGRE.makeRestApiRequest()({[dokumentdatatype.REDUSERT_UTBETALING_AARSAK]: arsaker}));
      }
    }
  });
}

class VedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakProsessStegPanelDef;
