import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { AksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

export const isAksjonspunktOpen = (statusKode?: string): boolean => statusKode === aksjonspunktStatus.OPPRETTET;
export const harAksjonspunkt = (aksjonspunkter: AksjonspunktDto[], kode: AksjonspunktCodes): boolean =>
  !!aksjonspunkter.find(akspunkt => akspunkt.definisjon === kode);

export const finnAksjonspunkt = (
  aksjonspunkter: AksjonspunktDto[],
  kode: AksjonspunktCodes,
): AksjonspunktDto | undefined => aksjonspunkter.find(akspunkt => akspunkt.definisjon === kode);

export const harÅpentAksjonspunkt = (aksjonspunkter: AksjonspunktDto[], kode: AksjonspunktCodes): boolean => {
  const aksjonspunkt = finnAksjonspunkt(aksjonspunkter, kode);
  return isAksjonspunktOpen(aksjonspunkt?.status);
};

export const aksjonspunktErUtført = (aksjonspunkter: AksjonspunktDto[], kode: AksjonspunktCodes): boolean => {
  const aksjonspunkt = finnAksjonspunkt(aksjonspunkter, kode);
  return aksjonspunkt?.status === aksjonspunktStatus.UTFØRT;
};
