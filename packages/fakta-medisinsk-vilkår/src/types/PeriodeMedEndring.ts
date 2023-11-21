import { Period } from '@navikt/k9-fe-period-utils';

export interface PerioderMedEndringResponse {
  perioderMedEndringer: PeriodeMedEndring[];
}

export interface PeriodeMedEndring {
  periode: Period;
  endrerVurderingSammeBehandling: boolean;
  endrerAnnenVurdering: boolean;
}
