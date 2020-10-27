import React from 'react';

import UnntakProsessIndex from '@k9-sak-web/prosess-unntak';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UnntakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.MANUELL_VURDERING_VILKÅR];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, featureToggles }) => ({
    fagsak,
    featureToggles,
  });
}

class UnntakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UNNTAK;

  getTekstKode = () => 'Behandlingspunkt.Unntak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UnntakProsessStegPanelDef;
