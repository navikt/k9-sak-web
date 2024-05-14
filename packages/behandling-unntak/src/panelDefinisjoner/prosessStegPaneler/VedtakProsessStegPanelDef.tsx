import React from 'react';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { Aksjonspunkt, Behandling, Fagsak, Vilkar } from '@k9-sak-web/types';

import findStatusForVedtak from '../vedtakStatusUtleder';
import { UnntakBehandlingApiKeys } from '../../data/unntakBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakProsessIndex {...props} />;

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
    UnntakBehandlingApiKeys.TILBAKEKREVINGVALG,
    UnntakBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING,
    UnntakBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV,
    UnntakBehandlingApiKeys.DOKUMENTDATA_HENTE,
  ];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({
    vilkar,
    aksjonspunkter,
    behandling,
    aksjonspunkterForSteg,
  }: {
    vilkar: Vilkar[];
    aksjonspunkter: Aksjonspunkt[];
    behandling: Behandling;
    aksjonspunkterForSteg: Aksjonspunkt[];
  }) => findStatusForVedtak(vilkar, aksjonspunkter, aksjonspunkterForSteg, behandling.behandlingsresultat);

  getData = ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    rettigheter,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    fagsak,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
  }: {
    previewCallback: () => void;
    hentFritekstbrevHtmlCallback: () => void;
    rettigheter: any;
    aksjonspunkter: Aksjonspunkt[];
    vilkar: Vilkar[];
    simuleringResultat: any;
    fagsak: Fagsak;
    personopplysninger: any;
    arbeidsgiverOpplysningerPerId: any;
    lagreDokumentdata: () => void;
  }) => ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    aksjonspunkter,
    vilkar,
    simuleringResultat,
    ytelseTypeKode: fagsak.sakstype,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    personopplysninger,
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
