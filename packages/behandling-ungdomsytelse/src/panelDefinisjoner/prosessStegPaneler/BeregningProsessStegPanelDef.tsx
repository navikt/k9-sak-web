import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import UngBeregningIndex from '@k9-sak-web/gui/prosess/ung-beregning/UngBeregningIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Vilkar } from '@k9-sak-web/types';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UngBeregningIndex {...props} />;
  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ vilkar }: { vilkar: Vilkar[] }) => {
    return vilkar
      ?.find(v => v.vilkarType.kode === vilkarType.UNGDOMSPROGRAMVILKARET)
      ?.perioder?.some(p => p.vilkarStatus.kode === vilkarUtfallType.OPPFYLT)
      ? vilkarUtfallType.OPPFYLT
      : vilkarUtfallType.IKKE_VURDERT;
  };
}

class BeregningProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNING;

  getTekstKode = () => 'Behandlingspunkt.Beregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningProsessStegPanelDef;
