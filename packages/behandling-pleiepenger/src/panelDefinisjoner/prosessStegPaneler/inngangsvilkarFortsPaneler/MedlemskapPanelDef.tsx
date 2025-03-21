import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { PleiepengerBehandlingApiKeys } from '../../../data/pleiepengerBehandlingApi';

class MedlemskapPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'MEDLEMSKAP';

  getTekstKode = () => 'Medlemskap';

  getKomponent = props => {
    if (props.featureToggles.BRUK_V2_VILKAR_OVERSTYRING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
    }
    return this.overstyringDef.getKomponent(props);
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR];

  getVilkarKoder = () => [vilkarType.MEDLEMSKAPSVILKARET];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.MEDLEMSKAP];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

export default MedlemskapPanelDef;
