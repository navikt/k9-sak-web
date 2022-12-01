import { Period } from '@navikt/k9-period-utils';
import Periode from '../periodeTsType';

import Vurderingsresultat from '../Vurderingsresultat';

export interface InstitusjonPeriode {
  institusjon: string;
  journalpostId: string;
  periode: Periode;
}

export interface InstitusjonPeriodeMedResultat extends InstitusjonPeriode {
  periode: Period;
  resultat: Vurderingsresultat;
}
export interface InstitusjonVurdering {
  begrunnelse: string;
  journalpostId: string;
  resultat: Vurderingsresultat;
}
export interface InstitusjonVurderingMedPeriode extends InstitusjonVurdering {
  periode: Period;
  institusjon: string;
}
