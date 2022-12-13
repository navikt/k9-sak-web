import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { OpplaeringspengerBehandlingApiKeys } from '@k9-sak-web/behandling-opplaeringspenger/src/data/opplaeringspengerBehandlingApi';
import FaktaOpplaering from '@k9-sak-web/fakta-opplaering';

export const FaktaOpplaeringContext = React.createContext(null);

class OpplaeringFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OPPLAERING;

  getTekstKode = () => 'Opplaering.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING, aksjonspunktCodes.VURDER_NØDVENDIGHET];

  getEndepunkter = () => [
    OpplaeringspengerBehandlingApiKeys.GJENNOMGÅTT_OPPLÆRING,
    OpplaeringspengerBehandlingApiKeys.NØDVENDIG_OPPLÆRING,
  ];

  // eslint-disable-next-line arrow-body-style
  getKomponent = props => {
    console.log(props);
    const løsAksjonspunktGjennomgåOpplæring = vurdering =>
      props.submitCallback([
        {
          kode: aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING,
          begrunnelse: 'Gjennomgått opplæring er behandlet',
          ...vurdering,
        },
      ]);
    const løsAksjonspunktNødvendighet = vurdering =>
      props.submitCallback([
        { kode: aksjonspunktCodes.VURDER_NØDVENDIGHET, begrunnelse: 'Nødvendighet er behandlet', ...vurdering },
      ]);

    const contextProps = {
      aksjonspunkter: props.aksjonspunkter,
      gjennomgåttOpplæring: props.gjennomgåttOpplæring,
      nødvendigOpplæring: props.nødvendigOpplæring,
      løsAksjonspunktGjennomgåOpplæring,
      løsAksjonspunktNødvendighet,
      readOnly: props.readOnly,
    };
    return (
      <FaktaOpplaeringContext.Provider value={contextProps}>
        <FaktaOpplaering />
      </FaktaOpplaeringContext.Provider>
    );
  };

  getOverstyrVisningAvKomponent = () => true;
}

export default OpplaeringFaktaPanelDef;
