import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

class UngdomsprogrammetPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'UNGDOMSPROGRAMMET';

  getTekstKode = () => 'Inngangsvilkar.Ungdomsprogrammet';

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [];

  getVilkarKoder = () => [vilkarType.UNGDOMSPROGRAMMET];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default UngdomsprogrammetPanelDef;
