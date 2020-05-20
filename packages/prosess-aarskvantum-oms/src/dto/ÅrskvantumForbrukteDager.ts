import UttaksplanType from './UttaksplanType';
import Rammevedtak from './Rammevedtak';

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallKoronadager?: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager: number;
  restdager: number;
  antallDagerInfotrygd?: number;
  sisteUttaksplan: UttaksplanType;
  rammevedtak: Rammevedtak[];
}

export default ÅrskvantumForbrukteDager;
