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

export const qFeatureToggles = {
  ...rootFeatureToggles,
  ...baseQFeatureToggles,
  ...ungFeatureToggleOverrides,
  //VIS_ALLE_ASYNC_ERRORS: true,
  VIS_FERIEPENGER_PANEL: true,
  BRUK_V2_TILKJENT_YTELSE: true,
} as const satisfies FeatureToggles & FeatureTogglesForQ;

export const prodFeatureToggles = {
  ...rootFeatureToggles,
  ...baseProdFeatureToggles,
  ...ungFeatureToggleOverrides,
  FLYTT_ALDERSVILKAR: false,
} as const satisfies FeatureToggles & FeatureTogglesForProd;
