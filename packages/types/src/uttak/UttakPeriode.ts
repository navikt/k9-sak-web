import Aktivitet from './Aktivitet';
import GraderingAvslagÅrsak from './GraderingAvslagÅrsak';

interface UttakPeriode {
  aktiviteter: Aktivitet[];
  begrunnelse?: string;
  flerbarnsdager: boolean;
  fom: string;
  graderingAvslagÅrsak: GraderingAvslagÅrsak;
  id?: string;
}

export default UttakPeriode;
