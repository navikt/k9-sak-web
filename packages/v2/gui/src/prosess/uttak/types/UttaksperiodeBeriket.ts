import type { UttaksperiodeInfo } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UttaksperiodeInfo.js';
import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';

/*
 * Utvider UttaksperiodeInfo med flagg for opphold til neste periode
 */
export interface UttaksperiodeBeriket extends UttaksperiodeInfo {
  harOppholdTilNestePeriode?: boolean;
  periode: Periode;
}
