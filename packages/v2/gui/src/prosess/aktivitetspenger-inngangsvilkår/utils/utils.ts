import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export const aksjonspunktErÅpent = (ap?: AksjonspunktDto) => (ap ? ap.status !== AksjonspunktStatus.UTFØRT : false);
