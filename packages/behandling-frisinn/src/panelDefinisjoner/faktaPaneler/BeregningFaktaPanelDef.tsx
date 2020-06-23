import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class BeregningFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  getTekstKode = () => 'BeregningInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN];

  getKomponent = props => <BeregningFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag }) => !!beregningsgrunnlag;

  getData = ({ beregningsgrunnlag }) => ({
    erOverstyrer: false,
    beregningsgrunnlag,
  });
}

export default BeregningFaktaPanelDef;
