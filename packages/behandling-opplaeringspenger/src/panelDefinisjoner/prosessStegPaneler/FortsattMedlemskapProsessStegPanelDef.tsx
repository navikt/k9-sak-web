import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

class FortsattMedlemskapProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORTSATTMEDLEMSKAP;

  getTekstKode = () => 'Behandlingspunkt.FortsattMedlemskap';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default FortsattMedlemskapProsessStegPanelDef;
