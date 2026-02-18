import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { safeConstCombine } from '../../../../typecheck/safeConstCombine.js';

export type AksjonspunktDefinisjon =
  | k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon;

/**
 * NB: Denne objekt konstant inneheld ikkje verdier for k9-tilbake/ung-tilbake sidan disse har inkompatible verdier for
 * nokon av properties. Ulik verdi for bla FORESLÅ_VEDTAK (5004 istadenfor 5015 som dei andre har)
 */
export const AksjonspunktDefinisjon = safeConstCombine(
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
) satisfies Record<string, AksjonspunktDefinisjon>;

// Sidan AksjonspunktDefinisjon objekt ikkje inneheld verdiane frå tilbake, lag array som inkluderer disse her, for bruk
// i skjema validering av mulige input verdier, etc.
const alleVerdierSet = new Set<AksjonspunktDefinisjon>(Object.values(AksjonspunktDefinisjon));
Object.values(foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon).forEach(
  v => alleVerdierSet.add(v),
);
Object.values(sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon).forEach(v =>
  alleVerdierSet.add(v),
);
export const alleAksjonspunktDefinisjonVerdier = [...alleVerdierSet];
