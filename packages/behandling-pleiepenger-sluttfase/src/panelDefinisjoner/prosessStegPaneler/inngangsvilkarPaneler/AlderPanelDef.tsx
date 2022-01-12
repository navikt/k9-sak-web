import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';

class AlderPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'ALDER';

  getTekstKode = () => 'Inngangsvilkar.Alder';

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [];

  getVilkarKoder = () => [vilkarType.ALDERSVILKARET];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default AlderPanelDef;
