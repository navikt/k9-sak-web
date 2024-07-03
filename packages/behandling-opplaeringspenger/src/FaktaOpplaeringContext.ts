import React from 'react';

import { ReisetidVurdering } from '@k9-sak-web/fakta-opplaering/src/reisetid/ReisetidTypes';
import {
  Aksjonspunkt,
  GjennomgaaOpplaeringVurdering,
  NoedvendighetPerioder,
  NoedvendighetVurdering,
  Periode,
} from '@k9-sak-web/types';
import Dokument from '@k9-sak-web/types/src/sykdom/Dokument';

export const FaktaOpplaeringContext = React.createContext<FaktaOpplaeringContextTypes | null>(null);

export interface FaktaOpplaeringContextTypes {
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  løsAksjonspunktGjennomgåOpplæring: (v: any) => void;
  løsAksjonspunktNødvendighet: (v: any) => void;
  løsAksjonspunktReisetid: (v: any) => void;
  nødvendigOpplæring: {
    vurderinger: NoedvendighetVurdering[];
    perioder: NoedvendighetPerioder[];
  };
  opplaeringDokumenter: Dokument[];
  reisetid: {
    perioder: {
      opplæringsperiode: Periode;
    }[];
    vurderinger: ReisetidVurdering[];
  };
  gjennomgåttOpplæring: {
    vurderinger: GjennomgaaOpplaeringVurdering[];
  };
}
