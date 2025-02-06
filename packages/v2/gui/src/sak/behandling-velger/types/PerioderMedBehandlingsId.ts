import type { Periode, PeriodeMedÅrsaker } from '@k9-sak-web/backend/k9sak/generated';

export type PerioderMedBehandlingsId = {
  id: number;
  perioder: Periode[];
  perioderMedÅrsak: PeriodeMedÅrsaker[];
};
