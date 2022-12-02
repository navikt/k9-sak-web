import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OverstyrBeregningFaktaIndex from '@fpsak-frontend/fakta-overstyr-beregning';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class OverstyrBeregningFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OVERSTYRING;

  getTekstKode = () => 'OverstyrBeregningPanel.OverstyrBeregning';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT];

  getKomponent = props => {
    const {
      arbeidsgiverOpplysningerPerId,
      overstyrInputBeregning,
      submitCallback,
      readOnly,
      submittable,
      aksjonspunkter,
    } = props;
    return (
      <OverstyrBeregningFaktaIndex
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        overstyrInputBeregning={overstyrInputBeregning}
        submitCallback={submitCallback}
        readOnly={readOnly}
        submittable={submittable}
        aksjonspunkter={aksjonspunkter}
      />
    );
  };

  getEndepunkter = (): string[] => [OpplaeringspengerBehandlingApiKeys.OVERSTYR_INPUT_BEREGNING];

  getData = ({ arbeidsgiverOpplysningerPerId }) => ({ arbeidsgiverOpplysningerPerId });
}

export default OverstyrBeregningFaktaPanelDef;
