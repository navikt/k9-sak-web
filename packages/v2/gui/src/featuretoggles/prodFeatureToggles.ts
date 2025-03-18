import type { FeatureToggles } from './FeatureToggles.js';

export const prodFeatureToggles = {
  KLAGE_KABAL: true,
  VARSELTEKST: true,
  DOKUMENTDATA: false,
  UNNTAKSBEHANDLING: false,
  //KLAGEBEHANDLING: true,
  //TILBAKE: true,
  TYPE_MEDISINSKE_OPPLYSNINGER_BREV: true,
  LOS_MARKER_BEHANDLING: true,
  LOS_MARKER_BEHANDLING_SUBMIT: false,
  FRITEKST_REDIGERING: true,
  //INKLUDER_KALENDER_PILS: false,
  SKJUL_AVSLUTTET_ARBEIDSGIVER: false,
  OMS_PUNSJSTRIPE: true,
  OVERSTYR_BEREGNING: false,
  BRUK_V2_MELDINGER: true,
  NYE_NOKKELTALL: false,
  UTVIDET_VARSELFELT: true,
  SKILL_UT_PRIVATPERSON: true,
  AUTOMATISK_VURDERT_MEDLEMSKAP: true,
  OPPTJENING_READ_ONLY_PERIODER: true,
  BRUK_INNTEKTSGRADERING_I_UTTAK: true,
  SAK_MENY_V2: false,
  AKSJONSPUNKT_OVERLAPPENDE_SAKER: false,
  BRUK_V2_BEHANDLING_VELGER: false,
  HISTORIKK_V2_VIS: true,
  VIS_BEGRUNNELSE_FRA_BRUKER_I_KRONISK_SYK: true,
  NY_INNTEKT_EGET_PANEL: false,
  BRUK_V2_FAKTA_INSTITUSJON: false,
  BRUK_V2_VILKAR_OVERSTYRING: false,
  FIX_SOKNADSFRIST_KALENDER_OG_READONLY: false,
  OPPLAERINGSPENGER: false,
  FJERN_BEGRUNNELSE_PROSESS_BEREGNING: false,
} satisfies FeatureToggles;
