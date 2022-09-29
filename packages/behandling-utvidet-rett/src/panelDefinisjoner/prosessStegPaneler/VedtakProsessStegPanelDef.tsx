import React from 'react';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import findStatusForVedtak from '@fpsak-frontend/utils/src/findStatusForVedtak';
import { UtvidetRettBehandlingApiKeys } from '../../data/utvidetRettBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.FORESLA_VEDTAK, aksjonspunktCodes.FATTER_VEDTAK];

  getEndepunkter = () => [
    UtvidetRettBehandlingApiKeys.TILBAKEKREVINGVALG,
    UtvidetRettBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING,
    UtvidetRettBehandlingApiKeys.MEDLEMSKAP,
    UtvidetRettBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV,
    UtvidetRettBehandlingApiKeys.DOKUMENTDATA_HENTE,
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
    fagsak,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
  }) => ({
    previewCallback,
    hentFritekstbrevHtmlCallback,
    aksjonspunkter,
    vilkar,
    personopplysninger,
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
