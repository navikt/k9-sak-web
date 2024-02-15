import { KodeverkMedNavn } from '../kodeverk';

export interface GraderingAvslagÅrsak extends KodeverkMedNavn {
  gyldigFom: string;
  gyldigTom: string;
}

export default GraderingAvslagÅrsak;
