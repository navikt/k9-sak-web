import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import VergeFaktaIndexV2 from '@k9-sak-web/gui/fakta/verge/ui/VergeFaktaIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { OmsorgspengerBehandlingApiKeys } from '../../data/omsorgspengerBehandlingApi';

class VergeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.VERGE;

  getTekstKode = () => 'RegistrereVergeInfoPanel.Info';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_VERGE];

  getEndepunkter = () => [OmsorgspengerBehandlingApiKeys.VERGE];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_VERGE) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return (
        <VergeFaktaIndexV2
          aksjonspunkter={deepCopyProps.aksjonspunkter}
          submitCallback={deepCopyProps.submitCallback}
          readOnly={deepCopyProps.readOnly}
          harApneAksjonspunkter={deepCopyProps.harApneAksjonspunkter}
          submittable={deepCopyProps.submittable}
        />
      );
    }
    return <VergeFaktaIndex {...props} />;
  };
}

export default VergeFaktaPanelDef;
