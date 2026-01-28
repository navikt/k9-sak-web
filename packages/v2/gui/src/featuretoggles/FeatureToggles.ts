import type { FeatureTogglesFor } from './FeatureTogglesFor.js';

export const rootFeatureToggles = {
  UNNTAKSBEHANDLING: false,
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
} satisfies Readonly<{ [K: `${Uppercase<string>}`]: false }>; // Alle toggles skal vere false i utgangspunktet

// Endrer typen på rootFeatureToggles til boolean
type RootFeatureToggles = Readonly<{
  [K in keyof typeof rootFeatureToggles]: boolean;
}>;

// Ønsker at alle andre spesifikasjoner skal ha true som verdi.
export type FeatureTogglesOverride = Readonly<
  Partial<{
    [K in keyof RootFeatureToggles]: true;
  }>
>;

export type FeatureToggles = Readonly<RootFeatureToggles & FeatureTogglesFor>;

// Her kan Q feature toggles for både for ung og k9 settast.
export const baseQFeatureToggles = {
  isFor: 'Q',
  UNNTAKSBEHANDLING: true,
  LOS_MARKER_BEHANDLING_SUBMIT: true,
  VIS_ALLE_ASYNC_ERRORS: true,
  BRUK_V2_TILKJENT_YTELSE: true,
  VIS_FERIEPENGER_PANEL: true,
} satisfies FeatureTogglesOverride & FeatureTogglesFor;

// Her kan PROD feature toggles for både for ung og k9 settast.
export const baseProdFeatureToggles = {
  isFor: 'prod',
} satisfies FeatureTogglesOverride & FeatureTogglesFor;

// Denne typen blir brukt til å unngå at definering av felles feature toggle for Q og prod på ung eller k9 nivå
// kan overskrive feature toggle verdi definert i baseQFeatureToggles eller baseProdFeatureToggles, sidan dette
// sannsynlegvis kan vere utilsikta/forvirrande viss det skjer.
export type DeploymentSpecificFeatureTogglesOverride = {
  [K in keyof typeof baseQFeatureToggles | keyof typeof baseProdFeatureToggles]?: never;
} & FeatureTogglesOverride;
