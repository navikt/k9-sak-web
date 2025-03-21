import type {
  Periode as K9Periode,
  PeriodeMedÅrsaker as K9PeriodeMedÅrsaker,
} from '@k9-sak-web/backend/k9sak/generated';
import type {
  Periode as UngPeriode,
  PeriodeMedÅrsaker as UngPeriodeMedÅrsaker,
} from '@k9-sak-web/backend/ungsak/generated';

export type K9UngPeriode = K9Periode | UngPeriode;
export type K9UngPeriodeMedÅrsaker = K9PeriodeMedÅrsaker | UngPeriodeMedÅrsaker;

export type PerioderMedBehandlingsId = {
  id: number;
  perioder: K9UngPeriode[];
  perioderMedÅrsak: K9UngPeriodeMedÅrsaker[];
};
