import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

class InstitusjonPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'INSTITUSJON';

  getTekstKode = () => 'Inngangsvilkar.Institusjon';

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getVilkarKoder = () => [];

  getOverstyrVisningAvKomponent = () => true;
}

export default InstitusjonPanelDef;
