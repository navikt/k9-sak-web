import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

/**
 * Aksjonspunktene som hører til uttak-steget per ytelse. Brukes både av Uttak-komponenten og av
 * prosessteg-definisjonene i behandlingspakkene, slik at listene ikke kan komme i utakt.
 */
export const relevanteUttakAksjonspunkter = (sakstype: FagsakYtelsesType | undefined): AksjonspunktDefinisjon[] => {
  switch (sakstype) {
    case fagsakYtelsesType.PLEIEPENGER_SYKT_BARN:
      return [
        AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
        AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
        AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
        AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
      ];
    case fagsakYtelsesType.OPPLÆRINGSPENGER:
      return [
        AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
        AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
        AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
      ];
    case fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE:
      return [AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK, AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK];
    default:
      return [];
  }
};
