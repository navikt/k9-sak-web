import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { OpplaeringspengerBehandlingApiKeys } from '@k9-sak-web/behandling-opplaeringspenger/src/data/opplaeringspengerBehandlingApi';
import FaktaInstitusjon from '@k9-sak-web/fakta-institusjon';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class InstitusjonFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INSTITUSJON;

  getTekstKode = () => 'Institusjon.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.INSTITUSJON];

  // eslint-disable-next-line arrow-body-style
  getKomponent = props => {
    const løsAksjonspunkt = vurdering =>
      props.submitCallback([
        { kode: aksjonspunktCodes.VURDER_INSTITUSJON, begrunnelse: 'Institusjon er behandlet', ...vurdering },
      ]);
    return (
      <FaktaInstitusjon
        perioder={props.institusjon?.perioder}
        vurderinger={props.institusjon?.vurderinger}
        readOnly={props.readOnly}
        løsAksjonspunkt={løsAksjonspunkt}
      />
    );
  };

  getOverstyrVisningAvKomponent = () => true;
}

export default InstitusjonFaktaPanelDef;
