import React from 'react';

import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import NoedvendighetPanelDef from './opplaeringPaneler/NoedvendighetPanelDef';
import GjennomgaaOpplaeringPanelDef from './opplaeringPaneler/GjennomgaaOpplaeringPanelDef';

class OpplaeringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING,
    aksjonspunktCodes.VURDER_NØDVENDIGHET,
    aksjonspunktCodes.VURDER_REISETID,
  ];

  getTekstKode = () => 'Behandlingspunkt.Opplaering';

  getPanelDefinisjoner = () => [new GjennomgaaOpplaeringPanelDef(), new NoedvendighetPanelDef()];
}

export default OpplaeringProsessStegPanelDef;
