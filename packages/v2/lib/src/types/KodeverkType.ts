/*
 * Overføring av kodeverkTyper fra tidligere, usikker på hvorfor det skal være duplikater
 * i denne listen. Antar at jeg skriver vekk duplikatene ifm refaktorering av kodeverk
 * eslint-disable @typescript-eslint/no-duplicate-enum-values *
 */

export enum KodeverkType {
  ARBEID_TYPE = 'ArbeidType',
  AVSLAGSARSAK = 'Avslagsårsak',
  INNVILGET_AARSAK = 'InnvilgetÅrsak',
  VENT_AARSAK = 'Venteårsak',
  BEHANDLING_AARSAK = 'BehandlingÅrsakType',
  KLAGE_AVVIST_AARSAK = 'KlageAvvistÅrsak',
  KLAGE_MEDHOLD_ARSAK = 'KlageMedholdÅrsak',
  OMSORGSOVERTAKELSE_VILKAR_TYPE = 'OmsorgsovertakelseVilkårType',
  MEDLEMSKAP_MANUELL_VURDERING_TYPE = 'MedlemskapManuellVurderingType',
  VERGE_TYPE = 'VergeType',
  LANDKODER = 'Landkoder',
  MORS_AKTIVITET = 'MorsAktivitet',
  VIRKSOMHET_TYPE = 'VirksomhetType',
  OVERFOERING_AARSAK_TYPE = 'OverføringÅrsak',
  PERSONSTATUS_TYPE = 'PersonstatusType',
  FAGSAK_STATUS = 'FagsakStatus',
  RELATERT_YTELSE_TILSTAND = 'RelatertYtelseTilstand',
  RELATERT_YTELSE_TYPE = 'RelatertYtelseType',
  FAGSAK_YTELSE = 'FagsakYtelseType',
  FORELDRE_TYPE = 'ForeldreType',
  FAMILIE_HENDELSE_TYPE = 'FamilieHendelseType',
  INNSYN_RESULTAT_TYPE = 'InnsynResultatType',
  BEHANDLING_TYPE = 'BehandlingType',
  OPPHOLD_ARSAK = 'OppholdÅrsak',
  UTSETTELSE_AARSAK_TYPE = 'UtsettelseÅrsak',
  UTSETTELSE_GRADERING_KVOTE = 'UttakPeriodeType',
  //   UTTAK_PERIODE_TYPE = 'UttakPeriodeType',
  OPPTJENING_AKTIVITET_TYPE = 'OpptjeningAktivitetType',
  REVURDERING_VARSLING_ÅRSAK = 'RevurderingVarslingÅrsak',
  MANUELL_BEHANDLING_AARSAK = 'ManuellBehandlingÅrsak',
  UTTAK_PERIODE_VURDERING_TYPE = 'UttakPeriodeVurderingType',
  IKKE_OPPFYLT_AARSAK = 'IkkeOppfyltÅrsak',
  //   UTTAK_AVSLAG_ARSAK = 'IkkeOppfyltÅrsak',
  INNTEKTSKATEGORI = 'Inntektskategori',
  BEREGNINGSGRUNNLAG_ANDELTYPER = 'BeregningsgrunnlagAndeltype',
  AKTIVITET_STATUS = 'AktivitetStatus',
  ARBEIDSKATEGORI = 'Arbeidskategori',
  FAGSYSTEM = 'Fagsystem',
  REGION = 'Region',
  SIVILSTAND_TYPE = 'SivilstandType',
  DOKUMENT_TYPE_ID = 'DokumentTypeId',
  FAKTA_OM_BEREGNING_TILFELLE = 'FaktaOmBeregningTilfelle',
  GRADERING_AVSLAG_AARSAK = 'GraderingAvslagÅrsak',
  SKJERMLENKE_TYPE = 'SkjermlenkeType',
  BEHANDLING_RESULTAT_TYPE = 'BehandlingResultatType',
  ARBEIDSFORHOLD_HANDLING_TYPE = 'ArbeidsforholdHandlingType',
  HISTORIKK_OPPLYSNING_TYPE = 'HistorikkOpplysningType',
  HISTORIKK_ENDRET_FELT_TYPE = 'HistorikkEndretFeltType',
  HISTORIKK_ENDRET_FELT_VERDI_TYPE = 'HistorikkEndretFeltVerdiType',
  HISTORIKKINNSLAG_TYPE = 'HistorikkinnslagType',
  HISTORIKK_AKTOER = 'HistorikkAktør',
  HISTORIKK_AVKLART_SOEKNADSPERIODE_TYPE = 'HistorikkAvklartSoeknadsperiodeType',
  HISTORIKK_RESULTAT_TYPE = 'HistorikkResultatType',
  BEHANDLING_STATUS = 'BehandlingStatus',
  FAR_SOEKER_TYPE = 'FarSøkerType',
  MEDLEMSKAP_DEKNING = 'MedlemskapDekningType',
  MEDLEMSKAP_TYPE = 'MedlemskapType',
  STOENADSKONTOTYPE = 'StønadskontoType',
  KONSEKVENS_FOR_YTELSEN = 'KonsekvensForYtelsen',
  UTTAK_ARBEID_TYPE = 'UttakArbeidType',
  UTTAK_UTSETTELSE_TYPE = 'UttakUtsettelseType',
  PERIODE_RESULTAT_AARSAK = 'PeriodeResultatÅrsak',
  VILKAR_TYPE = 'VilkårType',
  AKTSOMHET = 'Aktsomhet',
  VURDERING = 'AnnenVurdering',
  VEDTAK_RESULTAT_TYPE = 'VedtakResultatType',
  PERMISJONSBESKRIVELSE_TYPE = 'PermisjonsbeskrivelseType',
  VURDER_ARBEIDSFORHOLD_HISTORIKKINNSLAG = 'VurderArbeidsforholdHistorikkinnslag',
  TILBAKEKR_VIDERE_BEH = 'VidereBehandling',
  HENDELSE_TYPE = 'HendelseType',
  HENDELSE_UNDERTYPE = 'HendelseUnderType',
  VURDER_AARSAK = 'VurderÅrsak',
  ÅRSAK_TIL_VURDERING = 'ÅrsakTilVurdering',
}

/*
AktivitetStatus: KodeverkMedNavn[];
  ArbeidType: KodeverkMedNavn[];
  ArbeidsforholdHandlingType: KodeverkMedNavn[];
  Arbeidskategori: KodeverkMedNavn[];
  Avslagsårsak: KodeverkMedNavn[];
  BehandlingResultatType: KodeverkMedNavn[];
  BehandlingStatus: KodeverkMedNavn[];
  BehandlingType: KodeverkMedNavn[];
  BehandlingÅrsakType: KodeverkMedNavn[];
  DokumentTypeId: KodeverkMedNavn[];
  FagsakStatus: KodeverkMedNavn[];
  FagsakYtelseType: KodeverkMedNavn[];
  Fagsystem: KodeverkMedNavn[];
  FaktaOmBeregningTilfelle: KodeverkMedNavn[];
  HistorikkAktør: KodeverkMedNavn[];
  HistorikkAvklartSoeknadsperiodeType: KodeverkMedNavn[];
  HistorikkBegrunnelseType: KodeverkMedNavn[];
  HistorikkEndretFeltType: KodeverkMedNavn[];
  HistorikkEndretFeltVerdiType: KodeverkMedNavn[];
  HistorikkOpplysningType: KodeverkMedNavn[];
  HistorikkResultatType: KodeverkMedNavn[];
  HistorikkinnslagType: KodeverkMedNavn[];
  Inntektskategori: KodeverkMedNavn[];
  KonsekvensForYtelsen: KodeverkMedNavn[];
  Landkoder: KodeverkMedNavn[];
  MedlemskapDekningType: KodeverkMedNavn[];
  MedlemskapManuellVurderingType: KodeverkMedNavn[];
  MedlemskapType: KodeverkMedNavn[];
  OppgaveÅrsak: KodeverkMedNavn[];
  OpptjeningAktivitetType: KodeverkMedNavn[];
  PermisjonsbeskrivelseType: KodeverkMedNavn[];
  PersonstatusType: KodeverkMedNavn[];
  Region: KodeverkMedNavn[];
  RelatertYtelseTilstand: KodeverkMedNavn[];
  RevurderingVarslingÅrsak: KodeverkMedNavn[];
  SivilstandType: KodeverkMedNavn[];
  SkjermlenkeType: KodeverkMedNavn[];
  Språkkode: KodeverkMedNavn[];
  TilbakekrevingVidereBehandling: KodeverkMedNavn[];
  UtenlandsoppholdÅrsak: KodeverkMedNavn[];
  VedtakResultatType: KodeverkMedNavn[];
  Venteårsak: KodeverkMedNavn[];
  VilkårType: KodeverkMedNavn[];
  VirksomhetType: KodeverkMedNavn[];
  VurderArbeidsforholdHistorikkinnslag: KodeverkMedNavn[];
  VurderÅrsak: KodeverkMedNavn[];
  ÅrsakTilVurdering: KodeverkMedNavn[];
  */
