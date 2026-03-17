import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import DirekteOvergangFaktaIndex from '@fpsak-frontend/fakta-direkte-overgang';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import DirekteOvergangFaktaIndexV2 from '@k9-sak-web/gui/fakta/direkte-overgang/DirekteOvergangFaktaIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class DirekteOvergangFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INFOTRYGDMIGRERING;

  getTekstKode = () => 'InfotrygdmigreringPanel.Infotrygdmigrering';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD,
    aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
  ];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_DIREKTE_OVERGANG) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return (
        <DirekteOvergangFaktaIndexV2
          submitCallback={deepCopyProps.submitCallback}
          readOnly={deepCopyProps.readOnly}
          submittable={deepCopyProps.submittable}
          aksjonspunkter={deepCopyProps.aksjonspunkter}
        />
      );
    }
    const { submitCallback, readOnly, submittable, aksjonspunkter } = props;
    return (
      <DirekteOvergangFaktaIndex
        submitCallback={submitCallback}
        readOnly={readOnly}
        submittable={submittable}
        aksjonspunkter={aksjonspunkter}
      />
    );
  };
}

export default DirekteOvergangFaktaPanelDef;
