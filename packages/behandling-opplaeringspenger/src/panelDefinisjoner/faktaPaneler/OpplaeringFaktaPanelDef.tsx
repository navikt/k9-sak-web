import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { OpplaeringspengerBehandlingApiKeys } from '@k9-sak-web/behandling-opplaeringspenger/src/data/opplaeringspengerBehandlingApi';
import FaktaOpplaering from '@k9-sak-web/fakta-opplaering';
import { Aksjonspunkt, NoedvendighetPerioder, NoedvendighetVurdering } from '@k9-sak-web/types';

export const FaktaOpplaeringContext = React.createContext(null);

export interface FaktaOpplaeringContextTypes {
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  løsAksjonspunktGjennomgåOpplæring: (v: any) => void;
  nødvendigOpplæring: {
    vurderinger: NoedvendighetVurdering[];
    perioder: NoedvendighetPerioder[];
  };
  sykdomDokumenter: {
    datert: string;
    id: string;
    links: {
      href: string;
      rel: string;
    };
  }[];
}

class OpplaeringFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OPPLAERING;

  getTekstKode = () => 'Opplaering.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING,
    aksjonspunktCodes.VURDER_NØDVENDIGHET,
    aksjonspunktCodes.VURDER_REISETID,
  ];

  getEndepunkter = () => [
    OpplaeringspengerBehandlingApiKeys.GJENNOMGÅTT_OPPLÆRING,
    OpplaeringspengerBehandlingApiKeys.NØDVENDIG_OPPLÆRING,
    OpplaeringspengerBehandlingApiKeys.REISETID,
    OpplaeringspengerBehandlingApiKeys.SYKDOM_DOKUMENTER_OVERSIKT,
  ];

  // eslint-disable-next-line arrow-body-style
  getKomponent = props => {
    const løsAksjonspunktGjennomgåOpplæring = perioder =>
      props.submitCallback([
        {
          kode: aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING,
          begrunnelse: 'Gjennomgått opplæring er behandlet',
          perioder,
        },
      ]);
    const løsAksjonspunktNødvendighet = vurdering =>
      props.submitCallback([
        { kode: aksjonspunktCodes.VURDER_NØDVENDIGHET, begrunnelse: 'Nødvendighet er behandlet', ...vurdering },
      ]);
    const løsAksjonspunktReisetid = vurdering =>
      props.submitCallback([
        { kode: aksjonspunktCodes.VURDER_REISETID, begrunnelse: 'Reisetid er behandlet', ...vurdering },
      ]);

    const contextProps = {
      aksjonspunkter: props.aksjonspunkter,
      gjennomgåttOpplæring: props.gjennomgåttOpplæring,
      nødvendigOpplæring: props.nødvendigOpplæring,
      sykdomDokumenter: props.sykdomDokumenterOversikt?.dokumenter,
      reisetid: props.reisetid,
      løsAksjonspunktGjennomgåOpplæring,
      løsAksjonspunktNødvendighet,
      løsAksjonspunktReisetid,
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
