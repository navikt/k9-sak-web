// LEGACY-UTTAK: Slettes når feature toggle NYTT_UTTAK_PANEL fjernes. Ikke endre.
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_FagsakYtelseType as FagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

/**
 * Aksjonspunktene gammelt uttak-panel regnet som relevante per ytelse. Hardkodet tidligere i hvert prosessteg.
 */
export const relevanteUttakAksjonspunkterLegacy = (
  sakstype: FagsakYtelseType | undefined,
): AksjonspunktDefinisjon[] => {
  switch (sakstype) {
    case FagsakYtelseType.PLEIEPENGER_SYKT_BARN:
      return [
        AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
        AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
        AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
        AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
      ];
    case FagsakYtelseType.OPPLÆRINGSPENGER:
      return [
        AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
        AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
        AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
      ];
    case FagsakYtelseType.PLEIEPENGER_NÆRSTÅENDE:
      return [AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK, AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK];
    default:
      return [];
  }
};
