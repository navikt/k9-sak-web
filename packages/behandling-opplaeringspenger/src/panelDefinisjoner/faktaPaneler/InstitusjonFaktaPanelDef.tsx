import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import FaktaInstitusjon from '@k9-sak-web/fakta-institusjon';
import { OpplaeringspengerBehandlingApiKeys } from '@k9-sak-web/behandling-opplaeringspenger/src/data/opplaeringspengerBehandlingApi';

class InstitusjonFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INSTITUSJON;

  getTekstKode = () => 'Institusjon.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.INSTITUSJON];

  getKomponent = props => (
    <FaktaInstitusjon perioder={props.institusjon?.perioder} vurderinger={props.institusjon?.vurderinger} />
  );

  getOverstyrVisningAvKomponent = () => true;
}

export default InstitusjonFaktaPanelDef;
