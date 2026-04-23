import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/generated/types.js';

export { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/generated/types.js';

// Midlertidige koder for aksjonspunkter fra lokal ung-sak branch (bosatt-vilkaar-med-varsling)
// som ennå ikke er publisert i @navikt/ung-sak-typescript-client
export const BostedAksjonspunktKode = {
  VURDER_BOSTED: '5140',
  FASTSETT_BOSTED: '5143',
} as const;

export type BostedAksjonspunktKode = (typeof BostedAksjonspunktKode)[keyof typeof BostedAksjonspunktKode];

export type AksjonspunktDefinisjonOrBosted =
  | ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | BostedAksjonspunktKode;
