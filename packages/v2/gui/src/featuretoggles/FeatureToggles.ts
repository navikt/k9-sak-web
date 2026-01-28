import type { FeatureTogglesFor } from './FeatureTogglesFor.js';

export const rootFeatureToggles = {
  UNNTAKSBEHANDLING: true,
  LOS_MARKER_BEHANDLING_SUBMIT: false,
  FIX_SOKNADSFRIST_KALENDER_OG_READONLY: false,
  OVERSTYR_BEREGNING: false,
  NYE_NOKKELTALL: false,
  UTVIDET_VARSELFELT: false, // Brukt i jsx
  BRUK_V2_FAKTA_INSTITUSJON: false,
  BRUK_V2_VILKAR_OPPTJENING: false,
  MARKERING_UTENLANDSTILSNITT: false,
  VIS_ALLE_ASYNC_ERRORS: false,
  VIS_FERIEPENGER_PANEL: false,
  FLYTT_ALDERSVILKAR: false,
  BRUK_V2_TILKJENT_YTELSE: false,
  BRUK_V2_INNTEKTSMELDING: false,
  UNG_KLAGE: false,
  SAKSBEHANDLERINITIERT_INNTEKTSMELDING: false,
};

export type RootFeatureTogglesOverride = Readonly<Partial<typeof rootFeatureToggles>>;

export type FeatureToggles = Readonly<typeof rootFeatureToggles & FeatureTogglesFor>;

// Her kan Q feature toggles for både for ung og k9 settast.
export const baseQFeatureToggles = {
  isFor: 'Q',
  LOS_MARKER_BEHANDLING_SUBMIT: true,
  VIS_ALLE_ASYNC_ERRORS: true,
  BRUK_V2_TILKJENT_YTELSE: true,
  VIS_FERIEPENGER_PANEL: true,
} satisfies RootFeatureTogglesOverride & FeatureTogglesFor;

// Her kan PROD feature toggles for både for ung og k9 settast.
export const baseProdFeatureToggles = {
  isFor: 'prod',
} satisfies RootFeatureTogglesOverride & FeatureTogglesFor;

// Denne typen blir brukt til å unngå at definering av felles feature toggle for Q og prod på ung eller k9 nivå
// kan overskrive feature toggle verdi definert i baseQFeatureToggles eller baseProdFeatureToggles, sidan dette
// sannsynlegvis kan vere utilsikta/forvirrande viss det skjer.
export type DeploymentSpecificFeatureTogglesOverride = RootFeatureTogglesOverride & {
  [K in keyof typeof baseQFeatureToggles | keyof typeof baseProdFeatureToggles]?: never;
};
