import Uttaksplan from './Uttaksplan';

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager: number;
  restdager: number;
  sisteUttaksplan: Uttaksplan;
}

export default ÅrskvantumForbrukteDager;
