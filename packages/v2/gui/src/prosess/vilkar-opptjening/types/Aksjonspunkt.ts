import type { sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';

export type Aksjonspunkt = {
  definisjon: AksjonspunktDto['definisjon'];
  status: AksjonspunktDto['status'];
};
