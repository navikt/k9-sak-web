import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import BarnFaktaIndex from '@k9-sak-web/fakta-barn-oms';
import BarnOmsFaktaIndex from '@k9-sak-web/gui/fakta/barn-oms/BarnOmsFaktaIndex.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_BARN_OMS) {
      return (
        <BarnOmsFaktaIndex
          behandlingUuid={props.behandling.uuid}
          behandlingVersjon={props.behandling.versjon}
          fagsakYtelseType={props.fagsak?.sakstype}
        />
      );
    }
    return <BarnFaktaIndex behandlingUuid={props.behandling.uuid} fagsaksType={props.fagsak?.sakstype} />;
  };

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager;
}

export default BarnFaktaPanelDef;
