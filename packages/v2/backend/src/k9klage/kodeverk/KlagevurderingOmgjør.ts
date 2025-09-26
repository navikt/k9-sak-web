import {
  type k9_klage_kodeverk_vedtak_KlageVurderingOmgjør as KlagevurderingOmgjørT,
  k9_klage_kodeverk_vedtak_KlageVurderingOmgjør as KlagevurderingOmgjørV,
} from '@navikt/k9-klage-typescript-client/types';

export type KlagevurderingOmgjørType = KlagevurderingOmgjørT;

export const KlagevurderingOmgjør = KlagevurderingOmgjørV;

export const isKlagevurderingOmgjørType = (txt?: string): txt is KlagevurderingOmgjørT =>
  txt != null && Object.values(KlagevurderingOmgjør).some(v => v === txt);
