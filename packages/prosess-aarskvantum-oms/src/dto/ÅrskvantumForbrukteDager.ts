import UttaksplanType from './UttaksplanType';

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager: number;
  restdager: number;
  sisteUttaksplan: UttaksplanType;
}

export default ÅrskvantumForbrukteDager;
