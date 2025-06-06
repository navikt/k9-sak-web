import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class AlderPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'ALDER';

  getTekstKode = () => 'Alder';

  getKomponent = props => {
    if (props.featureToggles.BRUK_V2_VILKAR_OVERSTYRING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
    }
    return this.overstyringDef.getKomponent(props);
  };

  getAksjonspunktKoder = () => [];

  getVilkarKoder = () => [vilkarType.ALDERSVILKARET];

  getOverstyrVisningAvKomponent = ({ vilkarForSteg }) => vilkarForSteg.length > 0;

  getData = data => this.overstyringDef.getData(data);
}

export default AlderPanelDef;
