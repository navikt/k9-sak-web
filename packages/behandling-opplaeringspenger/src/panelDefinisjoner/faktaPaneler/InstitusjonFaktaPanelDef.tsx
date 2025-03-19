import React, { useContext } from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import FaktaInstitusjon from '@k9-sak-web/fakta-institusjon';
import FaktaInstitusjonIndex from '@k9-sak-web/gui/fakta/institusjon/FaktaInstitusjonIndex.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { OpplaeringspengerBehandlingApiKeys } from '@k9-sak-web/behandling-opplaeringspenger/src/data/opplaeringspengerBehandlingApi';

const InstitusjonFaktaPanelComponent = props => {
  const featureToggles = useContext(FeatureTogglesContext);
  const løsAksjonspunkt = vurdering =>
    props.submitCallback([
      { kode: aksjonspunktCodes.VURDER_INSTITUSJON, begrunnelse: 'Institusjon er behandlet', ...vurdering },
    ]);

  if (featureToggles?.BRUK_V2_FAKTA_INSTITUSJON) {
    return (
      <FaktaInstitusjonIndex
        perioder={props.institusjon?.perioder}
        vurderinger={props.institusjon?.vurderinger}
        readOnly={props.readOnly}
        løsAksjonspunkt={løsAksjonspunkt}
      />
    );
  }
  return (
    <FaktaInstitusjon
      perioder={props.institusjon?.perioder}
      vurderinger={props.institusjon?.vurderinger}
      readOnly={props.readOnly}
      løsAksjonspunkt={løsAksjonspunkt}
    />
  );
};

class InstitusjonFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INSTITUSJON;

  getTekstKode = () => 'Institusjon.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.INSTITUSJON];

  getKomponent = props => <InstitusjonFaktaPanelComponent {...props} />;

  getOverstyrVisningAvKomponent = () => true;
}

export default InstitusjonFaktaPanelDef;
