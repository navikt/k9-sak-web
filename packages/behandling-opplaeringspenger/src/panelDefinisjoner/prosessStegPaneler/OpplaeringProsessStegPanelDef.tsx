import React from 'react';

import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

class PanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING,
    aksjonspunktCodes.VURDER_NØDVENDIGHET,
    aksjonspunktCodes.VURDER_REISETID,
  ];

  getTekstKode = () => 'Behandlingspunkt.Opplaering';

  getKomponent = props => this.overstyringDef.getKomponent(props);
}

class OpplaeringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getTekstKode = () => 'Behandlingspunkt.Opplaering';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default OpplaeringProsessStegPanelDef;
