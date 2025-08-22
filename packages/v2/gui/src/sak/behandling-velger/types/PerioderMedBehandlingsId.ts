import type {
  k9_sak_typer_Periode as K9Periode,
  k9_sak_kontrakt_krav_PeriodeMedÅrsaker as K9PeriodeMedÅrsaker,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  ung_sak_typer_Periode as UngPeriode,
  ung_sak_kontrakt_krav_PeriodeMedÅrsaker as UngPeriodeMedÅrsaker,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export type K9UngPeriode = K9Periode | UngPeriode;
export type K9UngPeriodeMedÅrsaker = K9PeriodeMedÅrsaker | UngPeriodeMedÅrsaker;

export type PerioderMedBehandlingsId = {
  id: number;
  perioder: K9UngPeriode[];
  perioderMedÅrsak: K9UngPeriodeMedÅrsaker[];
};
