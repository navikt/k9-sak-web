import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export type Aksjonspunkt = {
  definisjon: AksjonspunktDto['definisjon'];
  status: AksjonspunktDto['status'];
};
