import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export const aksjonspunktErÅpent = (ap?: AksjonspunktDto) => (ap ? ap.status !== AksjonspunktStatus.UTFØRT : false);

/**
 * Returnerer true når aksjonspunktet ikke krever handling.
 * Udefinert aksjonspunkt tolkes som at steget ikke har aksjonspunkt og dermed er løst.
 */
export const aksjonspunktErLøst = (ap?: AksjonspunktDto) => !aksjonspunktErÅpent(ap);
