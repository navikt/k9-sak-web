import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { type foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { safeConstCombine } from '../../../../typecheck/safeConstCombine.js';

export type AksjonspunktDefinisjon =
  | k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon
  | foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon;

export const AksjonspunktDefinisjon = safeConstCombine(
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  // k9-tilbake AksjonspunktDefinisjon er ikkje med i combined objekt her, den har ulike verdi for FORESLÅ_VEDTAK (5004 istadenfor 5015 som dei andre har)
  // foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon,
) satisfies Record<string, AksjonspunktDefinisjon>;
