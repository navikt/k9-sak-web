import { initQFeatureToggles, initProdFeatureToggles } from '../FeatureToggles.js';

// Her kan man overskrive feature toggles spesifikt for ung deployment, men kun feature toggles som ikkje spesifikt er
// definert å vere ulike for q/prod i baseQFeatureToggles eller baseProdFeatureToggles.
const k9SpecificFeatureToggles = {
  FLYTT_ALDERSVILKAR: true,
  UTVIDET_VARSELFELT: true,
} as const;

/**
 * Dette blir feature toggles for K9 i dev/Q miljø.
 *
 * NB: Sett verdier i baseQFeatureToggles istadenfor viss verdien ikkje må vere spesifikk for k9
 */
export const qFeatureToggles = initQFeatureToggles(k9SpecificFeatureToggles)({
  BRUK_V2_FAKTA_INSTITUSJON: true,
  BRUK_V2_INNTEKTSMELDING: true,
  MARKERING_UTENLANDSTILSNITT: true,
  NYE_NOKKELTALL: true,
  OVERSTYR_BEREGNING: true,
  SAKSBEHANDLERINITIERT_INNTEKTSMELDING: true,
  UNG_KLAGE: true, // XXX Skal denne kanskje vere false?
});

/**
 * Dette blir feature toggles for K9 i prod miljø.
 *
 * NB: Skal vanlegvis ikkje trenge å sette noko her.
 */
export const prodFeatureToggles = initProdFeatureToggles(k9SpecificFeatureToggles)({
  isFor: 'prod',
});
