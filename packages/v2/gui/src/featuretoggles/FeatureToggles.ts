import type { FeatureTogglesFor } from './FeatureTogglesFor.js';

export const rootFeatureToggles = {
  BRUK_V2_FAKTA_INSTITUSJON: false,
  BRUK_V2_INNTEKTSMELDING: false,
  BRUK_V2_TILKJENT_YTELSE: false,
  BRUK_V2_VILKAR_OPPTJENING: false,
  FIX_SOKNADSFRIST_KALENDER_OG_READONLY: false,
  FLYTT_ALDERSVILKAR: false,
  LOS_MARKER_BEHANDLING_SUBMIT: false,
  MARKERING_UTENLANDSTILSNITT: false,
  NYE_NOKKELTALL: false,
  OVERSTYR_BEREGNING: false,
  SAKSBEHANDLERINITIERT_INNTEKTSMELDING: false,
  UNG_KLAGE: false,
  UNNTAKSBEHANDLING: false,
  UTVIDET_VARSELFELT: false, // Brukt i jsx
  VIS_ALLE_ASYNC_ERRORS: false,
  VIS_FERIEPENGER_PANEL: false,
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
  BRUK_V2_TILKJENT_YTELSE: true,
  LOS_MARKER_BEHANDLING_SUBMIT: true,
  UNNTAKSBEHANDLING: true,
  VIS_ALLE_ASYNC_ERRORS: true,
  VIS_FERIEPENGER_PANEL: true,
} satisfies FeatureTogglesOverride & FeatureTogglesFor;

// Denne typen blir brukt til å unngå at definering av felles feature toggle for Q og prod på ung eller k9 nivå
// kan overskrive feature toggle verdi definert i baseQFeatureToggles eller baseProdFeatureToggles, sidan dette
// sannsynlegvis kan vere utilsikta/forvirrande viss det skjer.
export type DeploymentSpecificFeatureTogglesOverride = {
  [K in keyof typeof baseQFeatureToggles]?: never;
} & FeatureTogglesOverride;
