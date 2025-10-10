import { ung_kodeverk_vilkår_VilkårType as VilkårType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

class UngdomsprogramPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'UNGDOMSPROGRAM';

  getTekstKode = () => 'Ungdomsprogram';

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [];

  getVilkarKoder = () => [VilkårType.UNGDOMSPROGRAMVILKÅRET];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default UngdomsprogramPanelDef;
