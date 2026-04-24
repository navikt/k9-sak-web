import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

export const isAksjonspunktOpen = (statusKode?: string): boolean => statusKode === aksjonspunktStatus.OPPRETTET;

export const harAksjonspunkt = (aksjonspunkter: AksjonspunktDto[], kode: AksjonspunktDefinisjon): boolean =>
  !!aksjonspunkter.find(ap => ap.definisjon === kode);

export const finnAksjonspunkt = (
  aksjonspunkter: AksjonspunktDto[],
  kode: AksjonspunktDefinisjon,
): AksjonspunktDto | undefined => aksjonspunkter.find(ap => ap.definisjon === kode);

export const finnAktivtAksjonspunkt = (aksjonspunkter: AksjonspunktDto[]): AksjonspunktDto | undefined =>
  aksjonspunkter.find(ap => ap.status === aksjonspunktStatus.OPPRETTET);

export const harÅpentAksjonspunkt = (aksjonspunkter: AksjonspunktDto[], kode: AksjonspunktDefinisjon): boolean => {
  const aksjonspunkt = finnAksjonspunkt(aksjonspunkter, kode);
  return isAksjonspunktOpen(aksjonspunkt?.status);
};

export const aksjonspunktErUtført = (aksjonspunkter: AksjonspunktDto[], kode: AksjonspunktDefinisjon): boolean => {
  const aksjonspunkt = finnAksjonspunkt(aksjonspunkter, kode);
  return aksjonspunkt?.status === aksjonspunktStatus.UTFØRT;
};
