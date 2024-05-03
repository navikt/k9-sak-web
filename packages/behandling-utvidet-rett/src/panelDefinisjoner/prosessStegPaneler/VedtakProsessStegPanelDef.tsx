import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import VedtakProsessIndex from '@k9-sak-web/prosess-vedtak';
import findStatusForVedtak from '@k9-sak-web/utils/src/findStatusForVedtak';
import React from 'react';
import { UtvidetRettBehandlingApiKeys } from '../../data/utvidetRettBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.SJEKK_TILBAKEKREVING,
  ];

  getEndepunkter = () => [
    UtvidetRettBehandlingApiKeys.TILBAKEKREVINGVALG,
    UtvidetRettBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING,
    UtvidetRettBehandlingApiKeys.MEDLEMSKAP,
    UtvidetRettBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV,
    UtvidetRettBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV,
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
    ytelseTypeKode: fagsak.sakstype.kode,
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
