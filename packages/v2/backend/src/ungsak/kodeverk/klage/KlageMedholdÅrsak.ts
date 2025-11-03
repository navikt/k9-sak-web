import { ung_kodeverk_klage_KlageMedholdÅrsak as KlageMedholdÅrsak } from '../../generated/types.js';

export const isKlageMedholdÅrsak = (maybe: unknown): maybe is KlageMedholdÅrsak =>
  maybe != null && typeof maybe == 'string' && Object.values(KlageMedholdÅrsak).some(v => v == maybe);

export { KlageMedholdÅrsak };
