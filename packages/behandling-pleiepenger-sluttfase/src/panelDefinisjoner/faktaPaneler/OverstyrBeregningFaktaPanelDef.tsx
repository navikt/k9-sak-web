import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import OverstyrBeregningFaktaIndex from '@k9-sak-web/fakta-overstyr-beregning';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

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

  getEndepunkter = (): string[] => [PleiepengerSluttfaseBehandlingApiKeys.OVERSTYR_INPUT_BEREGNING];

  getData = ({ arbeidsgiverOpplysningerPerId }) => ({ arbeidsgiverOpplysningerPerId });
}

export default OverstyrBeregningFaktaPanelDef;
