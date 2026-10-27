import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import BarnFaktaIndex from '@k9-sak-web/fakta-barn-oms';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => (
    <BarnFaktaIndex behandlingUuid={props.behandling.uuid} fagsaksType={props.fagsak?.sakstype} />
  );

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager;
}

export default BarnFaktaPanelDef;
