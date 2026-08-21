import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import DirekteOvergangFaktaIndex from '@fpsak-frontend/fakta-direkte-overgang';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

class DirekteOvergangFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INFOTRYGDMIGRERING;

  getTekstKode = () => 'InfotrygdmigreringPanel.Infotrygdmigrering';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD,
    aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
  ];

  getKomponent = props => {
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
