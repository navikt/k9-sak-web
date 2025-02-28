/* eslint-disable class-methods-use-this */
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'OMSORGENFOR';

  getTekstKode = () => 'Omsorg';

  getKomponent = props => {
    if (props.featureToggles.BRUK_V2_VILKAR_OVERSTYRING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
    }
    return this.overstyringDef.getKomponent(props);
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR];

  getVilkarKoder = () => [vilkarType.OMSORGENFORVILKARET];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default OmsorgenForPanelDef;
