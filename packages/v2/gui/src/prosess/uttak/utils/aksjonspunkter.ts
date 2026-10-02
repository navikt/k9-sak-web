import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { relevanteUttakAksjonspunkter } from '../relevanteUttakAksjonspunkter.js';

export const harEtUløstAksjonspunktIUttak = (
  aksjonspunkter: Aksjonspunkt[],
  sakstype: FagsakYtelsesType | undefined,
): boolean => {
  const relevanteAksjonspunkter = relevanteUttakAksjonspunkter(sakstype);
  return aksjonspunkter.some(
    ap =>
      ap.status === aksjonspunktStatus.OPPRETTET &&
      ap.definisjon !== undefined &&
      ap.definisjon !== AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK &&
      relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === ap.definisjon),
  );
};
