/* eslint-disable class-methods-use-this */
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
class OmsorgenForPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'OMSORGENFOR';

  getTekstKode = () => 'Omsorg';

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR];

  getVilkarKoder = () => [vilkarType.OMSORGENFORVILKARET];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default OmsorgenForPanelDef;
