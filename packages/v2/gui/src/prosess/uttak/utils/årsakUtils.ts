import type { UttaksperiodeInfoÅrsaker } from '@k9-sak-web/backend/k9sak/generated';

export const harÅrsak = (årsaker: UttaksperiodeInfoÅrsaker[], årsak: UttaksperiodeInfoÅrsaker): boolean =>
  årsaker.includes(årsak);
