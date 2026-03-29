import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export const aksjonspunktErÅpent = (ap?: AksjonspunktDto) =>
  ap ? ap.status !== ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.UTFØRT : false;
