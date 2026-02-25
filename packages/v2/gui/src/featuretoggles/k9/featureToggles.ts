import { initProdFeatureToggles, initQFeatureToggles } from '../FeatureToggles.js';

/**
 * Toggles satt her bli gjeldande kun for k9, men både i Q og prod.
 *
 * NB: Toggles satt her skal ikkje vere satt i baseQFeatureToggles i ../FeatureToggles.ts. Det blir då kompileringsfeil.
 */
const k9SpecificFeatureToggles = {
  FLYTT_ALDERSVILKAR: true,
  UTVIDET_VARSELFELT: true,
  SKJUL_PROSESS_MENY_V2_VELGER: true,
} as const;

/**
 * Dette blir feature toggles for K9 i dev/Q miljø.
 *
 * Det er produktet av feature toggles definert i ../FeatureToggles.ts og denne fila.
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
  BRUK_V2_VILKAR_OPPTJENING: true,
  PROSESS_MENY_V2: true,
});

/**
 * Dette blir feature toggles for K9 i prod miljø.
 *
 * Det er produktet av feature toggles definert i ../FeatureToggles.ts og denne fila.
 *
 * NB: Skal vanlegvis ikkje trenge å sette noko her.
 */
export const prodFeatureToggles = initProdFeatureToggles(k9SpecificFeatureToggles)({
  isFor: 'prod',
});
