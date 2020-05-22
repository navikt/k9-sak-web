import UttaksplanType from './UttaksplanType';
import Rammevedtak from './Rammevedtak';

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
  rammevedtak: Rammevedtak[];
}

export default ÅrskvantumForbrukteDager;
