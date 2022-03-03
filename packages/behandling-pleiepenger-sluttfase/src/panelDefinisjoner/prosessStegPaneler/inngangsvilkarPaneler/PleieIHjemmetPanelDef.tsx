import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';

class PleieIHjemmetPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'PLEIE-I-HJEMMET';

  getTekstKode = () => 'Inngangsvilkar.PleieIHjemmet';

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [];

  getVilkarKoder = () => [vilkarType.ALDERSVILKARET];

  getOverstyrVisningAvKomponent = () => true;

  getData = data => this.overstyringDef.getData(data);
}

export default PleieIHjemmetPanelDef;
