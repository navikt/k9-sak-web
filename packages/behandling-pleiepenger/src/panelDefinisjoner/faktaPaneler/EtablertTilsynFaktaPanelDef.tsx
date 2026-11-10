import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';
import React from 'react';
import EtablertTilsyn from '../../components/EtablertTilsyn';

class EtablertTilsynFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ETABLERT_TILSYN;

  getTekstKode = () => 'EtablertTilsynInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.NATTEVÅK,
    aksjonspunktCodes.BEREDSKAP,
    AksjonspunktDefinisjon.OVERSTYRING_AV_NATTEVÅK,
    AksjonspunktDefinisjon.OVERSTYRING_AV_BEREDSKAP,
  ];

  getKomponent = props => <EtablertTilsyn {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
}

export default EtablertTilsynFaktaPanelDef;
