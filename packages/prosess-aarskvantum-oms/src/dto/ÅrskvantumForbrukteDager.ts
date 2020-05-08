import UttaksplanType from './UttaksplanType';

interface ÅrskvantumForbrukteDager {
  totaltAntallDager: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager: number;
  restdager: number;
  benyttetRammemelding: boolean;
  antallDagerInfotrygd?: number;
  sisteUttaksplan: UttaksplanType;
}

export default ÅrskvantumForbrukteDager;
