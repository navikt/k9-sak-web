import type { UttaksperiodeInfo } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UttaksperiodeInfo.js';
import type { K9Periode as Periode } from '@k9-sak-web/backend/k9sak/typer/K9Periode.js';

/*
 * Utvider UttaksperiodeInfo med flagg for opphold til neste periode
 */
export interface UttaksperiodeBeriket extends UttaksperiodeInfo {
  harOppholdTilNestePeriode?: boolean;
  periode: Periode;
}
