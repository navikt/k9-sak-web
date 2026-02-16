import type {
  k9_sak_typer_Periode as Periode,
  pleiepengerbarn_uttak_kontrakter_UttaksperiodeInfo as UttaksperiodeInfo,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

/*
 * Utvider UttaksperiodeInfo med flagg for opphold til neste periode
 */
export interface UttaksperiodeBeriket extends UttaksperiodeInfo {
  harOppholdTilNestePeriode?: boolean;
  periode: Periode;
}
