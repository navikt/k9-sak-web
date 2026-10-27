import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import BarnFaktaIndex from '@k9-sak-web/fakta-barn-oms';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => <BarnFaktaIndex behandlingUuid={props.behandling.uuid} />;

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager;

  getData = ({ forbrukteDager }) => ({ barn: forbrukteDager?.barna || [] });
}

export default BarnFaktaPanelDef;
