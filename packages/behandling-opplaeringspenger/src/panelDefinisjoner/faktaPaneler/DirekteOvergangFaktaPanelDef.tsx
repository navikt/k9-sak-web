import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import DirekteOvergangFaktaIndex from '@k9-sak-web/fakta-direkte-overgang';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

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
