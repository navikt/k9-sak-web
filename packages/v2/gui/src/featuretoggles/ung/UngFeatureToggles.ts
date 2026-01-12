import type { FeatureTogglesFor } from '../FeatureTogglesFor.js';

export interface UngFeatureToggles extends FeatureTogglesFor {
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
  MARKERING_UTENLANDSTILSNITT: boolean;
  VIS_ALLE_ASYNC_ERRORS: boolean;
  VIS_FERIEPENGER_PANEL: boolean;
  FLYTT_ALDERSVILKAR: boolean;
  BRUK_V2_TILKJENT_YTELSE: boolean;
  BRUK_V2_INNTEKTSMELDING: boolean;
  UNG_KLAGE: boolean;
}
