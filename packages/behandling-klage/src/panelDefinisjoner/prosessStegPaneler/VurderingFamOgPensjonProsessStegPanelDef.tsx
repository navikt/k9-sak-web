import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import KlagevurderingProsessIndex from '@k9-sak-web/prosess-klagevurdering';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <KlagevurderingProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.BEHANDLE_KLAGE_NFP];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, saveKlageText, klageVurdering, previewCallback }) => ({
    fagsak,
    saveKlage: saveKlageText,
    klageVurdering,
    previewCallback,
  });
}

class VurderingFamOgPensjonProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.KLAGE_NAV_FAMILIE_OG_PENSJON;

  getTekstKode = () => 'Behandlingspunkt.CheckKlageNFP';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VurderingFamOgPensjonProsessStegPanelDef;
