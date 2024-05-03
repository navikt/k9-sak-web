import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';

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
