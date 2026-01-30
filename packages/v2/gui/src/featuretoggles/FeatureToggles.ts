import type { FeatureTogglesFor, FeatureTogglesForProd, FeatureTogglesForQ } from './FeatureTogglesFor.js';

/**
 * Alle feature toggles må leggast til her, med false som verdi. Må deretter i tillegg settast til true for den/dei
 * varianter ein ønsker å ha true på.
 */
const rootFeatureToggles = {
  BRUK_V2_AVREGNING: false,
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
} satisfies { [K: `${Uppercase<string>}`]: false }; // Alle toggles skal vere false i utgangspunktet

/**
 * Her kan Q feature toggles for både for ung og k9 settast.
 *
 * Meir ytelsesspesifikke toggles kan settast i k9/featureToggles.ts eller ung/featureToggles.ts
 */
const baseQFeatureToggles = {
  isFor: 'Q',
  BRUK_V2_TILKJENT_YTELSE: true,
  LOS_MARKER_BEHANDLING_SUBMIT: true,
  UNNTAKSBEHANDLING: true,
  VIS_ALLE_ASYNC_ERRORS: true,
  VIS_FERIEPENGER_PANEL: true,
} satisfies FeatureTogglesOverride & FeatureTogglesFor;

// Viss det trengs baseProdFeatureToggles kan det leggast til her på samme måte som baseQFeatureToggles.

/**
 * Initialiserer feature toggles objekt for Q miljø. Bygger opp objekt basert på rootFeatureToggles, baseQFeatureToggles ytelseSpesifikkeFeatureToggles og innsendte overrides
 * @param ytelseSpesifikkeFeatureToggles
 */
export const initQFeatureToggles =
  (ytelseSpesifikkeFeatureToggles: YtelseSpesifikkeFeatureToggles) =>
  (overrides: FeatureTogglesOverride): FeatureToggles & FeatureTogglesForQ => {
    return {
      ...rootFeatureToggles,
      ...baseQFeatureToggles,
      ...ytelseSpesifikkeFeatureToggles,
      ...overrides,
    } as const;
  };

/**
 * Initialiserer feature toggles objekt for prod miljø. Bygger opp objekt basert på rootFeatureToggles, ytelseSpesifikkeFeatureToggles og innsendte overrides
 * @param ytelseSpesifikkeFeatureToggles
 */
export const initProdFeatureToggles =
  (ytelseSpesifikkeFeatureToggles: YtelseSpesifikkeFeatureToggles) =>
  (overrides: FeatureTogglesOverride & FeatureTogglesForProd): FeatureToggles & FeatureTogglesForProd => {
    return {
      ...rootFeatureToggles,
      ...ytelseSpesifikkeFeatureToggles,
      ...overrides,
    } as const;
  };

// Diverse hjelpetyper:

// Endrer typen på rootFeatureToggles til boolean
type RootFeatureToggles = {
  [K in keyof typeof rootFeatureToggles]: boolean;
};

// Ønsker at alle andre spesifikasjoner skal ha true som verdi.
type FeatureTogglesOverride = Partial<{ [K in keyof RootFeatureToggles]: true }>;

// Denne typen blir brukt til å unngå at definering av felles feature toggle for Q og prod på ung eller k9 nivå
// kan overskrive feature toggle verdi definert i baseQFeatureToggles eller baseProdFeatureToggles, sidan dette
// sannsynlegvis kan vere utilsikta/forvirrande viss det skjer.
type YtelseSpesifikkeFeatureToggles = Readonly<
  {
    [K in keyof typeof baseQFeatureToggles]?: never;
  } & FeatureTogglesOverride
>;

export type FeatureToggles = Readonly<RootFeatureToggles & FeatureTogglesFor>;
