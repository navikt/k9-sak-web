import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import ReisetidPanelDef from './opplaeringPaneler/ReisetidPanelDef';
import LangvarigSykdomPanelDef from './opplaeringPaneler/LangvarigSykdomPanelDef';
import InstitusjonPanelDef from './opplaeringPaneler/InstitusjonPanelDef';
import NødvendigOpplæringPanelDef from './opplaeringPaneler/NødvendigOpplæringPanelDef';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';

class PanelDef extends ProsessStegPanelDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_INSTITUSJON,
    aksjonspunktCodes.VURDER_LANGVARIG_SYK,
    aksjonspunktCodes.VURDER_OPPLÆRING,
    aksjonspunktCodes.VURDER_REISETID,
  ];

  getKomponent = () => {
    return <div>test</div>;
  };

  getVilkarKoder = () => [
    vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON,
    vilkarType.LANGVARIG_SYKDOM,
    vilkarType.NØDVENDIG_OPPLÆRING,
  ];
}

class OpplaeringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPLAERING;

  getTekstKode = () => 'Behandlingspunkt.SykdomOgOpplaering';

  getPanelDefinisjoner = () => [
    new ReisetidPanelDef(),
    new LangvarigSykdomPanelDef(),
    new InstitusjonPanelDef(),
    new NødvendigOpplæringPanelDef(),
  ];
}

export default OpplaeringProsessStegPanelDef;
