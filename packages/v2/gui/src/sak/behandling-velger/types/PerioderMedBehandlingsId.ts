import type { Periode as K9Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import type { PeriodeMedÅrsaker as K9PeriodeMedÅrsaker } from '@k9-sak-web/backend/k9sak/kontrakt/krav/PeriodeMedÅrsaker.js';
import type { Periode as UngPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/Periode.js';
import type { PeriodeMedÅrsaker as UngPeriodeMedÅrsaker } from '@k9-sak-web/backend/ungsak/kontrakt/krav/PeriodeMedÅrsaker.js';

export type K9UngPeriode = K9Periode | UngPeriode;
export type K9UngPeriodeMedÅrsaker = K9PeriodeMedÅrsaker | UngPeriodeMedÅrsaker;

export type PerioderMedBehandlingsId = {
  id: number;
  perioder: K9UngPeriode[];
  perioderMedÅrsak: K9UngPeriodeMedÅrsaker[];
};
