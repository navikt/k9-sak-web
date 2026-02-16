import type { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import type BarnDto from './BarnDto';
import type UttaksplanType from './UttaksplanType';

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
