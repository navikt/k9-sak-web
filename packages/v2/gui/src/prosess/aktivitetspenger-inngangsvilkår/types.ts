import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export type SubmitCallback = (
  data: Array<{ kode: AksjonspunktDto['definisjon']; begrunnelse: string }>,
  aksjonspunkt: Array<Pick<AksjonspunktDto, 'definisjon'>>,
) => Promise<unknown>;
