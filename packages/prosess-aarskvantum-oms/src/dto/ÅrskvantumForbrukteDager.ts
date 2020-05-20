import UttaksplanType from './UttaksplanType';

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallKoronadager?: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager?: number;
  forbruktTid?: string;
  restdager?: number;
  restTid?: string;
  antallDagerInfotrygd?: number;
  sisteUttaksplan: UttaksplanType;
}

export default ÅrskvantumForbrukteDager;
