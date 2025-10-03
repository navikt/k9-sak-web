import {
  type pleiepengerbarn_uttak_kontrakter_UttaksperiodeInfo as UttaksperiodeInfo,
  type k9_sak_typer_Periode as Periode,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

/*
 * Utvider UttaksperiodeInfo med flagg for opphold til neste periode
 */
export interface UttaksperiodeBeriket extends UttaksperiodeInfo {
  harOppholdTilNestePeriode?: boolean;
  periode: Periode;
}
