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
  tilknyttedeDokumenter: string[];
}

export interface NoedvendighetPerioder {
  journalpostId: { journalpostId: string };
  periode: Period;
  noedvendighet: boolean;
  resultat: Vurderingsresultat;
}

export interface NoedvendighetVurdering extends Omit<NoedvendighetPerioder, 'periode'> {
  begrunnelse: string;
  perioder: Period[];
  tilknyttedeDokumenter: string[];
}
