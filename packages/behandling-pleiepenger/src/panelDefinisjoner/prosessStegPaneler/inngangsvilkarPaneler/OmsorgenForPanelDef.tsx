/* eslint-disable class-methods-use-this */
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'OMSORGENFOR';

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR];

  getVilkarKoder = () => [vilkarType.OMSORGENFORVILKARET];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default OmsorgenForPanelDef;
