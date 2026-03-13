import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { TiDagerProsessIndex } from '@k9-sak-web/gui/prosess/ti-dager/TiDagerProsess.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <TiDagerProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    '9017', // TODO: bytte ut med kode fra generert typescript når klart'
  ];

  getOverstyrVisningAvKomponent = () => true;

  getEndepunkter = () => [];
}

class TiDagerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.TI_DAGER;

  getTekstKode = () => 'Ti dager';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default TiDagerProsessStegPanelDef;
