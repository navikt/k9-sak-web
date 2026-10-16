import type { Årsak as UttaksperiodeInfoÅrsaker } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/Årsak.js';

export const harÅrsak = (årsaker: UttaksperiodeInfoÅrsaker[], årsak: UttaksperiodeInfoÅrsaker): boolean =>
  årsaker.includes(årsak);
