import { Period } from '@navikt/k9-period-utils';

import Vurderingsresultat from '../Vurderingsresultat';

export interface GjennomgaaOpplaeringPeriode {
  opplæring: Period;
  resultat: Vurderingsresultat;
}

export interface GjennomgaaOpplaeringVurdering {
  begrunnelse: string;
  resultat: Vurderingsresultat;
  opplæring: Period;
}

export interface NoedvendighetPerioder {
  journalpostId: { journalpostId: string };
  perioder: Period[];
  noedvendighet: boolean;
  resultat: Vurderingsresultat;
}

export interface NoedvendighetVurdering extends NoedvendighetPerioder {
  begrunnelse: string;
}
