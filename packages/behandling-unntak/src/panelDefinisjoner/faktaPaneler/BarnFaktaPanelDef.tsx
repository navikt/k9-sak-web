import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import BarnFaktaIndex from '@k9-sak-web/fakta-barn-oms';
import BarnOmsFaktaIndex from '@k9-sak-web/gui/fakta/barn-oms/BarnOmsFaktaIndex.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_BARN_OMS) {
      return <BarnOmsFaktaIndex behandlingUuid={props.behandling.uuid} behandlingVersjon={props.behandling.versjon} />;
    }
    return <BarnFaktaIndex behandlingUuid={props.behandling.uuid} />;
  };

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager;

  getData = ({ forbrukteDager }) => ({ barn: forbrukteDager?.barna || [] });
}

export default BarnFaktaPanelDef;
