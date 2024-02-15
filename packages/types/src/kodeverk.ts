export interface AlleKodeverk {
  AktivitetStatus: KodeverkMedNavn[];
  AnkeVurdering: KodeverkMedNavn[];
  ArbeidsforholdHandlingType: KodeverkMedNavn[];
  Arbeidskategori: KodeverkMedNavn[];
  ArbeidType: KodeverkMedNavn[];
  Avslagsårsak: { [key: string]: KodeverkMedNavn[] };
  BehandlingResultatType: KodeverkMedNavn[];
  BehandlingStatus: KodeverkMedNavn[];
  BehandlingType: KodeverkMedNavn[];
  BehandlingÅrsakType: KodeverkMedNavn[];
  BeregningsgrunnlagAndeltype: KodeverkMedNavn[];
  DokumentTypeId: KodeverkMedNavn[];
  FagsakStatus: KodeverkMedNavn[];
  FagsakYtelseType: KodeverkMedNavn[];
  Fagsystem: KodeverkMedNavn[];
  FaktaOmBeregningTilfelle: KodeverkMedNavn[];
  FamilieHendelseType: KodeverkMedNavn[];
  FarSøkerType: KodeverkMedNavn[];
  ForeldreType: KodeverkMedNavn[];
  GraderingAvslagÅrsak: Årsak[];
  HistorikkAktør: KodeverkMedNavn[];
  HistorikkBegrunnelseType: KodeverkMedNavn[];
  HistorikkEndretFeltType: KodeverkMedNavn[];
  HistorikkinnslagType: KodeverkMedNavn[];
  HistorikkOpplysningType: KodeverkMedNavn[];
  IkkeOppfyltÅrsak: Årsak[];
  InnsynResultatType: KodeverkMedNavn[];
  Inntektskategori: KodeverkMedNavn[];
  InnvilgetÅrsak: Årsak[];
  KlageAvvistÅrsak: KodeverkMedNavn[];
  KlageMedholdÅrsak: KodeverkMedNavn[];
  KonsekvensForYtelsen: KodeverkMedNavn[];
  Landkoder: KodeverkMedNavn[];
  ManuellBehandlingÅrsak: KodeverkMedNavn[];
  MedlemskapDekningType: KodeverkMedNavn[];
  MedlemskapManuellVurderingType: KodeverkMedNavn[];
  MedlemskapType: KodeverkMedNavn[];
  MorsAktivitet: KodeverkMedNavn[];
  OmsorgsovertakelseVilkårType: KodeverkMedNavn[];
  OppgaveÅrsak: KodeverkMedNavn[];
  OppholdÅrsak: KodeverkMedNavn[];
  OpptjeningAktivitetType: KodeverkMedNavn[];
  OverføringÅrsak: KodeverkMedNavn[];
  PermisjonsbeskrivelseType: KodeverkMedNavn[];
  PersonstatusType: KodeverkMedNavn[];
  Region: KodeverkMedNavn[];
  RelatertYtelseTilstand: KodeverkMedNavn[];
  RelatertYtelseType: KodeverkMedNavn[];
  RevurderingVarslingÅrsak: KodeverkMedNavn[];
  SivilstandType: KodeverkMedNavn[];
  SkjermlenkeType: KodeverkMedNavn[];
  StønadskontoType: KodeverkMedNavn[];
  TilbakekrevingVidereBehandling: KodeverkMedNavn[];
  UtenlandsoppholdÅrsak: KodeverkMedNavn[];
  UtsettelseÅrsak: KodeverkMedNavn[];
  UttakArbeidType: KodeverkMedNavn[];
  UttakPeriodeType: KodeverkMedNavn[];
  UttakPeriodeVurderingType: KodeverkMedNavn[];
  UttakUtsettelseType: KodeverkMedNavn[];
  Venteårsak: KodeverkMedNavn[];
  VergeType: KodeverkMedNavn[];
  VilkårType: KodeverkMedNavn[];
  VirksomhetType: KodeverkMedNavn[];
  VurderArbeidsforholdHistorikkinnslag: KodeverkMedNavn[];
  VurderÅrsak: KodeverkMedNavn[];
}

export interface KodeverkMedNavn {
  kode: string;
  kodeverk: string;
  navn: null | string;
}

export interface Årsak {
  gyldigFom: string;
  gyldigTom: string;
  kode: string;
  kodeverk: KodeverkEnum;
  navn: string;
}

export enum KodeverkEnum {
  GraderingAvslagAarsak = 'GRADERING_AVSLAG_AARSAK',
  IkkeOppfyltAarsak = 'IKKE_OPPFYLT_AARSAK',
  InnvilgetAarsak = 'INNVILGET_AARSAK',
}

export default AlleKodeverk;
