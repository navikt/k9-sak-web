import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

class LangvarigSykdomPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'LANGVARIG_SYKDOM';

  getTekstKode = () => 'Langvarig sykdom';

  getKomponent = props => {
    return this.overstyringDef.getKomponent({ ...props, skjulOverstyring: true });
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_LANGVARIG_SYK];

  getVilkarKoder = () => [VilkårType.LANGVARIG_SYKDOM];

  getData = ({
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  }): any => ({
    erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  });
}

export default LangvarigSykdomPanelDef;
