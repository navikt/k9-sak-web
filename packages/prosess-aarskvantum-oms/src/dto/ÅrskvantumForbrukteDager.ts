import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import UttaksplanType from './UttaksplanType';
import BarnDto from './BarnDto';

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallKoronadager?: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager?: number;
  forbruktTid?: string;
  restdager?: number;
  restTid?: string;
  antallDagerInfotrygd?: number;
  sisteUttaksplan?: UttaksplanType;
  rammevedtak: Rammevedtak[];
  barna: BarnDto[];
}

export default ÅrskvantumForbrukteDager;
