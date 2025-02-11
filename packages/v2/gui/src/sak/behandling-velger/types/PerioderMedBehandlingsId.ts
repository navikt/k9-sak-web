import type { Periode, PeriodeMedÅrsaker } from '@k9-sak-web/backend/k9sak/generated';
import type {
  Periode as UngPeriode,
  PeriodeMedÅrsaker as UngPeriodeMedÅrsaker,
} from '@k9-sak-web/backend/ungsak/generated';

export type PerioderMedBehandlingsId = {
  id: number;
  perioder: Periode[] | UngPeriode[];
  perioderMedÅrsak: PeriodeMedÅrsaker[] | UngPeriodeMedÅrsaker[];
};
