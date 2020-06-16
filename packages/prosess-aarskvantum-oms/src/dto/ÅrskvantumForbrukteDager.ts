import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
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
  rammevedtak: Rammevedtak[];
}

export default ÅrskvantumForbrukteDager;
