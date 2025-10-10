import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

class InstitusjonPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'INSTITUSJON';

  getTekstKode = () => 'Institusjon';

  getKomponent = props => {
    return this.overstyringDef.getKomponent({ ...props, skjulOverstyring: true });
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getVilkarKoder = () => [vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON];

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

export default InstitusjonPanelDef;
