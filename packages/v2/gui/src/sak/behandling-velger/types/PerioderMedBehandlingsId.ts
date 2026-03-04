import type { K9Periode } from '@k9-sak-web/backend/k9sak/typer/K9Periode.js';
import type { K9PeriodeMedÅrsaker } from '@k9-sak-web/backend/k9sak/kontrakt/krav/K9PeriodeMedÅrsaker.js';
import type { UngPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/UngPeriode.js';
import type { UngPeriodeMedÅrsaker } from '@k9-sak-web/backend/ungsak/kontrakt/krav/UngPeriodeMedÅrsaker.js';

export type K9UngPeriode = K9Periode | UngPeriode;
export type K9UngPeriodeMedÅrsaker = K9PeriodeMedÅrsaker | UngPeriodeMedÅrsaker;

export type PerioderMedBehandlingsId = {
  id: number;
  perioder: K9UngPeriode[];
  perioderMedÅrsak: K9UngPeriodeMedÅrsaker[];
};
