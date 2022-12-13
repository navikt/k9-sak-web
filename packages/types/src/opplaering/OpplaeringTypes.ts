import { Period } from '@navikt/k9-period-utils';

import Vurderingsresultat from '../Vurderingsresultat';

export interface GjennomgaaOpplaeringPeriode {
  opplæring: Period;
  reisetid: {
    reisetidTil: string;
    reisetidHjem: string;
  };
  resultat: Vurderingsresultat;
}

export interface GjennomgaaOpplaeringVurdering {
  begrunnelse: string;
  resultat: Vurderingsresultat;
  opplæring: Period;
  reisetid: string;
}
