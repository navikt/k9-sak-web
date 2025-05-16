import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';

export interface Aksjonspunkt {
  definisjon: NonNullable<AksjonspunktDto['definisjon']>;
  erAktivt: AksjonspunktDto['erAktivt'];
  status: NonNullable<AksjonspunktDto['status']>;
}
