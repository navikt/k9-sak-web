import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { OpplaeringspengerBehandlingApiKeys } from '../../../data/opplaeringspengerBehandlingApi';

class MedlemskapPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'MEDLEMSKAP';

  getTekstKode = () => 'Medlemskap';

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps });
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR];

  getVilkarKoder = () => [vilkarType.MEDLEMSKAPSVILKARET];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.MEDLEMSKAP];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

export default MedlemskapPanelDef;
