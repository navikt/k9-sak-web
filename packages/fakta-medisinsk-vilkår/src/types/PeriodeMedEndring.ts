import { Period } from '@fpsak-frontend/utils';

export interface PerioderMedEndringResponse {
  perioderMedEndringer: PeriodeMedEndring[];
}

export interface PeriodeMedEndring {
  periode: Period;
  endrerVurderingSammeBehandling: boolean;
  endrerAnnenVurdering: boolean;
}
