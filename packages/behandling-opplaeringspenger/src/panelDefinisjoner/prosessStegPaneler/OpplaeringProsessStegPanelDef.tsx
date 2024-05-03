import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import GjennomgaaOpplaeringPanelDef from './opplaeringPaneler/GjennomgaaOpplaeringPanelDef';
import NoedvendighetPanelDef from './opplaeringPaneler/NoedvendighetPanelDef';
import ReisetidPanelDef from './opplaeringPaneler/ReisetidPanelDef';

class OpplaeringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING,
    aksjonspunktCodes.VURDER_NØDVENDIGHET,
    aksjonspunktCodes.VURDER_REISETID,
  ];

  getTekstKode = () => 'Behandlingspunkt.Opplaering';

  getPanelDefinisjoner = () => [
    new GjennomgaaOpplaeringPanelDef(),
    new NoedvendighetPanelDef(),
    new ReisetidPanelDef(),
  ];
}

export default OpplaeringProsessStegPanelDef;
