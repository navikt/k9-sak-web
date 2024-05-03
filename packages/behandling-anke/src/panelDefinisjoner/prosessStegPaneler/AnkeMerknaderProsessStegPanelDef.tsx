import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import AnkeMerknaderProsessIndex from '@k9-sak-web/prosess-anke-merknader';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <AnkeMerknaderProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE_MERKNADER,
    aksjonspunktCodes.AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER,
  ];

  getData = ({ ankeVurdering, saveAnke, previewCallback }) => ({
    previewVedtakCallback: previewCallback,
    previewCallback,
    ankeVurdering,
    saveAnke,
  });
}

class AnkeMerknaderProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.ANKE_MERKNADER;

  getTekstKode = () => 'Behandlingspunkt.AnkeMerknader';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default AnkeMerknaderProsessStegPanelDef;
