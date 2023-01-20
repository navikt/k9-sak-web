import { Period } from '@navikt/k9-period-utils';
import Periode from '../periodeTsType';

import Vurderingsresultat from '../Vurderingsresultat';

export interface InstitusjonPeriode {
  institusjon: string;
  journalpostId: {
    journalpostId: string;
  };
  periode: Periode;
}

export interface InstitusjonPerioderMedResultat extends InstitusjonPeriode {
  perioder: Period[];
  resultat: Vurderingsresultat;
}
export interface InstitusjonVurdering {
  begrunnelse: string;
  journalpostId: {
    journalpostId: string;
  };
  resultat: Vurderingsresultat;
  perioder: Periode[];
}
export interface InstitusjonVurderingMedPerioder extends InstitusjonVurdering {
  perioder: Period[];
  institusjon: string;
  endretAv?: string;
  endretTidspunkt?: string;
}
