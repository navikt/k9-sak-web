import {
  rootFeatureToggles,
  type FeatureToggles,
  type DeploymentSpecificFeatureTogglesOverride,
  baseQFeatureToggles,
  baseProdFeatureToggles,
} from '../FeatureToggles.js';
import type { FeatureTogglesForProd, FeatureTogglesForQ } from '../FeatureTogglesFor.ts';

// Her kan man overskrive feature toggles spesifikt for ung deployment, men kun feature toggles som ikkje spesifikt er
// definert å vere ulike for q/prod i baseQFeatureToggles eller baseProdFeatureToggles.
const k9FeatureToggleOverrides = {
  UTVIDET_VARSELFELT: true,
} satisfies DeploymentSpecificFeatureTogglesOverride;

export const qFeatureToggles = {
  ...rootFeatureToggles,
  ...baseQFeatureToggles,
  ...k9FeatureToggleOverrides,

  OVERSTYR_BEREGNING: true,
  NYE_NOKKELTALL: true,
  BRUK_V2_FAKTA_INSTITUSJON: true,
  MARKERING_UTENLANDSTILSNITT: true,
  BRUK_V2_INNTEKTSMELDING: true,
  UNG_KLAGE: true, // TODO Skal denne kanskje vere false?
  SAKSBEHANDLERINITIERT_INNTEKTSMELDING: true,
} as const satisfies FeatureToggles & FeatureTogglesForQ;

export const prodFeatureToggles = {
  ...rootFeatureToggles,
  ...baseProdFeatureToggles,
  ...k9FeatureToggleOverrides,
  UNNTAKSBEHANDLING: false,
  LOS_MARKER_BEHANDLING_SUBMIT: false,
  FJERN_BEGRUNNELSE_PROSESS_BEREGNING: false,
} as const satisfies FeatureToggles & FeatureTogglesForProd;
