import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';
import NøkkeltallIndex from '@k9-sak-web/fakta-nokkeltall-oms';

class NøkkeltallFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.NØKKELTALL;

  getTekstKode = () => 'FaktaNøkkeltall.Title';

  getKomponent = props => <NøkkeltallIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ forbrukteDager }) => !!forbrukteDager?.sisteUttaksplan;

  getData = ({ forbrukteDager }) => forbrukteDager;
}

export default NøkkeltallFaktaPanelDef;
