import { VilkårMedPerioderDtoVilkarType } from '@k9-sak-web/backend/ungsak/generated';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class AlderPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'ALDER';

  getTekstKode = () => 'Alder';

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
  };

  getAksjonspunktKoder = () => [];

  getVilkarKoder = () => [VilkårMedPerioderDtoVilkarType.ALDERSVILKÅR];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default AlderPanelDef;
