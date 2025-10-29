import { ung_kodeverk_klage_KlageVurderingType as KlageVurdering } from '../../generated/types.js';

export const isKlageVurdering = (maybe: unknown): maybe is KlageVurdering =>
  maybe != null && typeof maybe == 'string' && Object.values(KlageVurdering).some(v => v == maybe);

export { KlageVurdering };
