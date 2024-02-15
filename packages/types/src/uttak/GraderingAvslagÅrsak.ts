import { Kodeverk } from '../kodeverk';

export interface GraderingAvslagÅrsak extends Kodeverk {
  gyldigFom: string;
  gyldigTom: string;
}

export default GraderingAvslagÅrsak;
