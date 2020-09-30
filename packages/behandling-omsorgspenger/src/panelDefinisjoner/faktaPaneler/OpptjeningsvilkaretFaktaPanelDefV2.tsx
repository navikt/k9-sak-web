import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';
import OpptjeningMicrofrontend from '../../opptjening-microfrontend/OpptjeningMicrofrontend';

class OpptjeningsvilkaretFaktaPanelDefV2 extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OPPTJENINGSVILKARET_V2;

  getTekstKode = () => 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING];

  getEndepunkter = () => [];

  getKomponent = props => {
    const submitCallback = data => {
      return console.log('Receieved data from microfrontend', data);
      /*
      return props.submitCallback([
        {
          kode: aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING,
          begrunnelse: 'blablabla',
          ...data,
        },
      ]); */
    };

    return <OpptjeningMicrofrontend behandling={props.behandling} submitCallback={submitCallback} />;
  };

  getOverstyrVisningAvKomponent = () => true;
}

export default OpptjeningsvilkaretFaktaPanelDefV2;
