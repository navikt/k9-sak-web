import { Period } from '@k9-sak-web/utils';

export interface PerioderMedEndringResponse {
  perioderMedEndringer: PeriodeMedEndring[];
}

export interface PeriodeMedEndring {
  periode: Period;
  endrerVurderingSammeBehandling: boolean;
  endrerAnnenVurdering: boolean;
}
