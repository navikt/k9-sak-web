import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import FaktaInstitusjon from '@k9-sak-web/fakta-institusjon';

class InstitusjonFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INSTITUSJON;

  getTekstKode = () => 'Institusjon.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getEndepunkter = () => [];

  getKomponent = props => <FaktaInstitusjon />;

  getOverstyrVisningAvKomponent = () => true;
}

export default InstitusjonFaktaPanelDef;
