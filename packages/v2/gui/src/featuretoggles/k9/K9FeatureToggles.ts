import type { FeatureTogglesFor } from '../FeatureTogglesFor.js';

export interface K9FeatureToggles extends FeatureTogglesFor {
  KLAGE_KABAL: boolean;
  DOKUMENTDATA: boolean; // Fjernast?
  UNNTAKSBEHANDLING: boolean;
  TYPE_MEDISINSKE_OPPLYSNINGER_BREV: boolean; // Fjernast?
  LOS_MARKER_BEHANDLING: boolean;
  LOS_MARKER_BEHANDLING_SUBMIT: boolean;
  FIX_SOKNADSFRIST_KALENDER_OG_READONLY: boolean; // Fjernast?
  OPPLAERINGSPENGER: boolean; // Fjernast?
  SKJUL_AVSLUTTET_ARBEIDSGIVER: boolean; // Fjernast?
  OVERSTYR_BEREGNING: boolean;
  NYE_NOKKELTALL: boolean;
  UTVIDET_VARSELFELT: boolean; // Brukt i jsx
  SKILL_UT_PRIVATPERSON: boolean;
  AUTOMATISK_VURDERT_MEDLEMSKAP: boolean;
  OPPTJENING_READ_ONLY_PERIODER: boolean;
  VIS_BEGRUNNELSE_FRA_BRUKER_I_KRONISK_SYK: boolean;
  NY_INNTEKT_EGET_PANEL: boolean;
  BRUK_V2_FAKTA_INSTITUSJON: boolean;
  FJERN_BEGRUNNELSE_PROSESS_BEREGNING: boolean;
  BRUK_V2_VILKAR_OPPTJENING: boolean;
  BRUK_MANGLER_LEGEERKLÆRING_I_TILSYN_OG_PLEIE: boolean;
  MARKERING_UTENLANDSTILSNITT: boolean;
  AKTIVER_AVSLAG_IKKE_INNTEKTSTAP: boolean;
  VIS_ALLE_ASYNC_ERRORS: boolean;
  VIS_FERIEPENGER_PANEL: boolean;
  FLYTT_ALDERSVILKAR: boolean;
  BRUK_V2_TILKJENT_YTELSE: boolean;
  UNG_KLAGE: boolean;
  KRONISK_TIDSBEGRENSET: boolean;
  V2_MELDINGER_FOR_TILBAKE: boolean;
  PROSESS_MENY_V2: boolean; // Aktiverer v2 prosessmeny-system
  PROSESS_MENY_V2_VELGER: boolean; // Viser toggle-knapp for å velge mellom legacy og v2 meny
}
