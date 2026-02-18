import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import UttaksplanType from './UttaksplanType';
import BarnDto from './BarnDto';

type Duration = string;

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallKoronadager?: number;
  antallDagerArbeidsgiverDekker: number;
  antallDagerFraværRapportertSomNyoppstartet: number;
  forbrukteDager?: number;
  forbruktTid?: Duration;
  restdager?: number;
  restTid?: Duration;
  antallDagerInfotrygd?: number;
  smitteverndager?: Duration;
  sisteUttaksplan?: UttaksplanType;
  rammevedtak: Rammevedtak[];
  barna: BarnDto[];
}

export default ÅrskvantumForbrukteDager;
