import React from 'react';

import { Aksjonspunkt, NoedvendighetPerioder, NoedvendighetVurdering } from '@k9-sak-web/types';
import Dokument from '@k9-sak-web/types/src/sykdom/Dokument';

export const FaktaOpplaeringContext = React.createContext(null);

export interface FaktaOpplaeringContextTypes {
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  løsAksjonspunktGjennomgåOpplæring: (v: any) => void;
  løsAksjonspunktNødvendighet: (v: any) => void;
  nødvendigOpplæring: {
    vurderinger: NoedvendighetVurdering[];
    perioder: NoedvendighetPerioder[];
  };
  saksbehandlere: { [key: string]: string };
  sykdomDokumenter: Dokument[];
}
