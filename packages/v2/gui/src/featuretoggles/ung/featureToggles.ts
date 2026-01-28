import {
  baseProdFeatureToggles,
  baseQFeatureToggles,
  rootFeatureToggles,
  type FeatureToggles,
  type DeploymentSpecificFeatureTogglesOverride,
} from '../FeatureToggles.js';
import type { FeatureTogglesForProd, FeatureTogglesForQ } from '../FeatureTogglesFor.js';

// Her kan man overskrive feature toggles spesifikt for ung deployment, men kun feature toggles som ikkje spesifikt er
// definert å vere ulike for q/prod i baseQFeatureToggles eller baseProdFeatureToggles.
const ungFeatureToggleOverrides = {
  BRUK_V2_FAKTA_INSTITUSJON: true,
  BRUK_V2_VILKAR_OPPTJENING: true,
  UNG_KLAGE: true,
  FIX_SOKNADSFRIST_KALENDER_OG_READONLY: true,
  NYE_NOKKELTALL: true,
} satisfies DeploymentSpecificFeatureTogglesOverride;

// Dette blir feature toggles for UNG i dev/Q miljø
export const qFeatureToggles = {
  ...rootFeatureToggles,
  ...baseQFeatureToggles,
  ...ungFeatureToggleOverrides,

  FLYTT_ALDERSVILKAR: true,
} as const satisfies FeatureToggles & FeatureTogglesForQ;

// Dette blir feature toggles for UNG i prod miljø
export const prodFeatureToggles = {
  ...rootFeatureToggles,
  ...baseProdFeatureToggles,
  ...ungFeatureToggleOverrides,

  LOS_MARKER_BEHANDLING_SUBMIT: true, // Er denne relevant for ung?
  UNNTAKSBEHANDLING: true,
} as const satisfies FeatureToggles & FeatureTogglesForProd;
