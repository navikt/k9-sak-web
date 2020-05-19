import UttaksplanType from './UttaksplanType';

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallKoronadager?: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager: number | string;
  restdager: number | string;
  antallDagerInfotrygd?: number;
  sisteUttaksplan: UttaksplanType;
}

export default ÅrskvantumForbrukteDager;
