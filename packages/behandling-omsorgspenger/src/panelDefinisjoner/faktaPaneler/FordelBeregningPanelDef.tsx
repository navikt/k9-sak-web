import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FordelBeregningIndex from '@fpsak-frontend/fakta-fordel-beregningsgrunnlag';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class FordelBeregningPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FORDELING;

  getTekstKode = () => 'FordelBeregningsgrunnlag.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
  ];

  getKomponent = props => <FordelBeregningIndex {...props} />;

  getOverstyrVisningAvKomponent = () => false;

  getData = ({ beregningsgrunnlag }) => ({
    beregningsgrunnlag,
  });
}

export default FordelBeregningPanelDef;
