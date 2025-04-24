import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import ReisetidPanelDef from './opplaeringPaneler/ReisetidPanelDef';
import LangvarigSykdomPanelDef from './opplaeringPaneler/LangvarigSykdomPanelDef';
import InstitusjonPanelDef from './opplaeringPaneler/InstitusjonPanelDef';
import NødvendigOpplæringPanelDef from './opplaeringPaneler/NødvendigOpplæringPanelDef';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

class OpplaeringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_INSTITUSJON,
    aksjonspunktCodes.VURDER_LANGVARIG_SYK,
    aksjonspunktCodes.VURDER_OPPLÆRING,
    aksjonspunktCodes.VURDER_REISETID,
  ];

  getTekstKode = () => 'Behandlingspunkt.Opplaering';

  getPanelDefinisjoner = () => [
    new InstitusjonPanelDef(),
    new LangvarigSykdomPanelDef(),
    new NødvendigOpplæringPanelDef(),
    new ReisetidPanelDef(),
  ];
}

export default OpplaeringProsessStegPanelDef;
