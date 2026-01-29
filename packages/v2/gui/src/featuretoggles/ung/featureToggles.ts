import { initQFeatureToggles, initProdFeatureToggles } from '../FeatureToggles.js';

/**
 * Toggles satt her bli gjeldande kun for ung, men både i Q og prod.
 *
 * NB: Toggles satt her skal ikkje vere satt i baseQFeatureToggles i ../FeatureToggles.ts. Det blir då kompileringsfeil.
 */
const ungSpecificFeatureToggles = {
  BRUK_V2_FAKTA_INSTITUSJON: true,
  BRUK_V2_VILKAR_OPPTJENING: true,
  FIX_SOKNADSFRIST_KALENDER_OG_READONLY: true,
  NYE_NOKKELTALL: true,
  UNG_KLAGE: true,
} as const;

/**
 * Dette blir feature toggles for UNG i dev/Q miljø.
 *
 * Det er produktet av feature toggles definert i ../FeatureToggles.ts og denne fila.
 *
 * NB: Sett verdier i baseQFeatureToggles istadenfor viss verdien ikkje må vere spesifikk for k9
 */
export const qFeatureToggles = initQFeatureToggles(ungSpecificFeatureToggles)({
  // Legg til featuretoggles for ung Q her
});

/**
 * Dette blir feature toggles for UNG i prod miljø.
 *
 * Det er produktet av feature toggles definert i ../FeatureToggles.ts og denne fila.
 *
 * NB: Skal vanlegvis ikkje trenge å sette noko her.
 */
export const prodFeatureToggles = initProdFeatureToggles(ungSpecificFeatureToggles)({
  isFor: 'prod',
  LOS_MARKER_BEHANDLING_SUBMIT: true, // Er denne relevant for ung?
  UNNTAKSBEHANDLING: true,
});
