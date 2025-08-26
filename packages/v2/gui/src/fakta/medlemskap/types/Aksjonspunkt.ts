import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export interface Aksjonspunkt {
  definisjon: NonNullable<AksjonspunktDto['definisjon']>;
  erAktivt: AksjonspunktDto['erAktivt'];
  status: NonNullable<AksjonspunktDto['status']>;
}
