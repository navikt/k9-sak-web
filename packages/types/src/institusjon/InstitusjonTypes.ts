import Periode from '../periodeTsType';
import Vurderingsresultat from '../Vurderingsresultat';

export interface InstitusjonPeriode {
  institusjon: string;
  journalpostId: string;
  periode: Periode;
}

export interface InstitusjonVurdering {
  begrunnelse: string;
  journalpostId: string;
  resultat: Vurderingsresultat;
}
