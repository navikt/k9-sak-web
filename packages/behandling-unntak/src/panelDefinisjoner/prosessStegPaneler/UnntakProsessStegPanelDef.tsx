import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import UnntakProsessIndex from '@k9-sak-web/prosess-unntak';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UnntakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ vilkar }) => ({
    vilkar,
  });
}

class UnntakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UNNTAK;

  getTekstKode = () => 'Behandlingspunkt.Unntak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UnntakProsessStegPanelDef;
