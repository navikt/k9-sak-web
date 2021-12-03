import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OverstyrBeregningFaktaIndex from '@fpsak-frontend/fakta-overstyr-beregning';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class OverstyrBeregningFaktaPanelDef extends FaktaPanelDef {
    getUrlKode = () => faktaPanelCodes.OVERSTYRING;

    getTekstKode = () => 'OverstyrBeregningPanel.OverstyrBeregning';

    getAksjonspunktKoder = () => [
        aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT,
    ];

    getKomponent = props => <OverstyrBeregningFaktaIndex {...props} />;

    getEndepunkter = (): string[] => [PleiepengerBehandlingApiKeys.OVERSTYR_INPUT_BEREGNING];


    getOverstyrVisningAvKomponent = ({ behandlngId }) => behandlngId;

    getData = ({ behandlingId, arbeidsgiverOpplysningerPerId }) => ({ behandlingId, arbeidsgiverOpplysningerPerId });
}

export default OverstyrBeregningFaktaPanelDef;
