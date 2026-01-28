import {
  rootFeatureToggles,
  type FeatureToggles,
  type DeploymentSpecificFeatureTogglesOverride,
  baseQFeatureToggles,
} from '../FeatureToggles.js';
import type { FeatureTogglesForProd, FeatureTogglesForQ } from '../FeatureTogglesFor.ts';

// Her kan man overskrive feature toggles spesifikt for ung deployment, men kun feature toggles som ikkje spesifikt er
// definert å vere ulike for q/prod i baseQFeatureToggles eller baseProdFeatureToggles.
const k9FeatureToggleOverrides = {
  FLYTT_ALDERSVILKAR: true,
  UTVIDET_VARSELFELT: true,
} satisfies DeploymentSpecificFeatureTogglesOverride;

// Dette blir feature toggles for K9 i dev/Q miljø
export const qFeatureToggles = {
  ...rootFeatureToggles,
  ...baseQFeatureToggles,
  ...k9FeatureToggleOverrides,

  BRUK_V2_FAKTA_INSTITUSJON: true,
  BRUK_V2_INNTEKTSMELDING: true,
  MARKERING_UTENLANDSTILSNITT: true,
  NYE_NOKKELTALL: true,
  OVERSTYR_BEREGNING: true,
  SAKSBEHANDLERINITIERT_INNTEKTSMELDING: true,
  UNG_KLAGE: true, // XXX Skal denne kanskje vere false?
} as const satisfies FeatureToggles & FeatureTogglesForQ;

// Dette blir feature toggles for K9 i prod miljø
export const prodFeatureToggles = {
  isFor: 'prod',
  ...rootFeatureToggles,
  ...k9FeatureToggleOverrides,
} as const satisfies FeatureToggles & FeatureTogglesForProd;
