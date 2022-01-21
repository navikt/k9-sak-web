import { Period } from '@navikt/k9-period-utils';

export interface PerioderMedEndringResponse {
    perioderMedEndringer: PeriodeMedEndring[];
}

export interface PeriodeMedEndring {
    periode: Period;
    endrerVurderingSammeBehandling: boolean;
    endrerAnnenVurdering: boolean;
}
