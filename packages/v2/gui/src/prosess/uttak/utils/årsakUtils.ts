import type { pleiepengerbarn_uttak_kontrakter_Årsak as UttaksperiodeInfoÅrsaker } from '@k9-sak-web/backend/k9sak/generated/types.js';

export const harÅrsak = (årsaker: UttaksperiodeInfoÅrsaker[], årsak: UttaksperiodeInfoÅrsaker): boolean =>
  årsaker.includes(årsak);
