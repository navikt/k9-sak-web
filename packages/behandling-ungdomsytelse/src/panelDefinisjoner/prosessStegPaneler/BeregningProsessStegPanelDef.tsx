import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import UngBeregningIndex from '@k9-sak-web/prosess-ung-beregning';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UngBeregningIndex {...props} />;
  getOverstyrVisningAvKomponent = () => true;

  // getEndepunkter = () => [UngdomsytelseBehandlingApiKeys.MEDLEMSKAP];

  // getData = ({ personopplysninger }) => ({
  //   personopplysninger,
  // });
}

class BeregningProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNING;

  getTekstKode = () => 'Behandlingspunkt.Beregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningProsessStegPanelDef;
