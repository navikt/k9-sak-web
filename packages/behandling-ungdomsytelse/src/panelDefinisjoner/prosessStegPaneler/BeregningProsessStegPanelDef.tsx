import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import UngBeregningIndex from '@k9-sak-web/gui/prosess/ung-beregning/UngBeregningIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UngBeregningIndex {...props} />;
  getOverstyrVisningAvKomponent = () => true;
}

class BeregningProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNING;

  getTekstKode = () => 'Behandlingspunkt.Beregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningProsessStegPanelDef;
