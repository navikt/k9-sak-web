import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import InstitusjonPanelDef from './opplaeringPaneler/InstitusjonPanelDef';
import LangvarigSykdomPanelDef from './opplaeringPaneler/LangvarigSykdomPanelDef';
import NødvendigOpplæringPanelDef from './opplaeringPaneler/NødvendigOpplæringPanelDef';

class OpplaeringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getTekstKode = () => 'Behandlingspunkt.SykdomOgOpplaering';

  getPanelDefinisjoner = () => [
    new InstitusjonPanelDef(),
    new LangvarigSykdomPanelDef(),
    new NødvendigOpplæringPanelDef(),
  ];
}

export default OpplaeringProsessStegPanelDef;
