import { ung_kodeverk_klage_KlageVurderingOmgjør as KlageVurderingOmgjør } from '../../generated/types.js';

export const isKlageVurderingOmgjør = (maybe: unknown): maybe is KlageVurderingOmgjør =>
  maybe != null && typeof maybe == 'string' && Object.values(KlageVurderingOmgjør).some(v => v == maybe);

export { KlageVurderingOmgjør };
