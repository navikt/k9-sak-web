import type { FeatureToggles } from './FeatureToggles.js';

export const qFeatureToggles = {
  KLAGE_KABAL: true,
  VARSELTEKST: true,
  DOKUMENTDATA: true,
  UNNTAKSBEHANDLING: true,
  TYPE_MEDISINSKE_OPPLYSNINGER_BREV: true,
  LOS_MARKER_BEHANDLING: true,
  LOS_MARKER_BEHANDLING_SUBMIT: true,
  FRITEKST_REDIGERING: true,
  SKJUL_AVSLUTTET_ARBEIDSGIVER: true,
  OMS_PUNSJSTRIPE: true,
  OVERSTYR_BEREGNING: true,
  BRUK_V2_MELDINGER: true,
  NYE_NOKKELTALL: true,
  UTVIDET_VARSELFELT: true,
  SKILL_UT_PRIVATPERSON: true,
  AUTOMATISK_VURDERT_MEDLEMSKAP: true,
  OPPTJENING_READ_ONLY_PERIODER: true,
  BRUK_INNTEKTSGRADERING_I_UTTAK: true,
  SAK_MENY_V2: true,
  AKSJONSPUNKT_OVERLAPPENDE_SAKER: true,
  BRUK_V2_BEHANDLING_VELGER: true,
  HISTORIKK_V2_VIS: true,
  VIS_BEGRUNNELSE_FRA_BRUKER_I_KRONISK_SYK: true,
  NY_INNTEKT_EGET_PANEL: true,
  BRUK_V2_FAKTA_INSTITUSJON: true,
  BRUK_V2_VILKAR_OVERSTYRING: true,
  FIX_SOKNADSFRIST_KALENDER_OG_READONLY: false,
  OPPLAERINGSPENGER: false,
  FJERN_BEGRUNNELSE_PROSESS_BEREGNING: true,
} satisfies FeatureToggles;
