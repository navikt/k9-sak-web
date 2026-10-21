import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export type OverstyringsaksjonspunktStatus = 'ÅPENT' | 'UTFØRT';

/**
 * Finner status for overstyringsaksjonspunkt (aksjonspunktType OVST) blant aksjonspunktene til et panel.
 * Saksbehandleroverstyring (SAOV) er ikke med, fordi den ikke krever overstyrerrolle.
 * Et åpent aksjonspunkt vinner over et utført.
 */
export const finnOverstyringsaksjonspunktStatus = (
  aksjonspunkter: ReadonlyArray<AksjonspunktDto>,
): OverstyringsaksjonspunktStatus | undefined => {
  const overstyringsaksjonspunkter = aksjonspunkter.filter(ap => ap.aksjonspunktType === aksjonspunktType.OVERSTYRING);
  if (overstyringsaksjonspunkter.some(ap => ap.status === aksjonspunktStatus.OPPRETTET)) {
    return 'ÅPENT';
  }
  if (overstyringsaksjonspunkter.some(ap => ap.status === aksjonspunktStatus.UTFØRT)) {
    return 'UTFØRT';
  }
  return undefined;
};

/** Varselet vises bare for saksbehandlere uten overstyrerrolle, og bare når det finnes et åpent eller utført overstyringsaksjonspunkt. */
export const skalViseOverstyringAksjonspunktVarsel = (
  aksjonspunkter: ReadonlyArray<AksjonspunktDto>,
  erOverstyrer: boolean,
): boolean => !erOverstyrer && finnOverstyringsaksjonspunktStatus(aksjonspunkter) !== undefined;
