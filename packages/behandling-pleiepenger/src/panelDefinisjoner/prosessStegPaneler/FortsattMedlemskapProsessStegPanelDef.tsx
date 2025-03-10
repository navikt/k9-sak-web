import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class PanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getKomponent = props => {
    if (props.featureToggles.BRUK_V2_VILKAR_OVERSTYRING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
    }
    return this.overstyringDef.getKomponent(props);
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

class FortsattMedlemskapProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORTSATTMEDLEMSKAP;

  getTekstKode = () => 'Fortsatt medlem';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default FortsattMedlemskapProsessStegPanelDef;
