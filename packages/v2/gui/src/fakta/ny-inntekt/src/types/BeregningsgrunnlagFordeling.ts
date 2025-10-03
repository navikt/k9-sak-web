import type { BeregningsgrunnlagArbeidsforhold } from './BeregningsgrunnlagArbeidsforhold';

export type TidligereUtbetalinger = Readonly<{
  fom: string;
  tom?: string;
  erTildeltRefusjon: boolean;
}>;

export type RefusjonTilVurderingAndel = Readonly<{
  aktivitetStatus: string;
  tidligereUtbetalinger?: TidligereUtbetalinger[];
  nyttRefusjonskravFom: string;
  fastsattNyttRefusjonskravFom?: string;
  tidligsteMuligeRefusjonsdato: string;
  arbeidsgiver?: {
    arbeidsgiverOrgnr?: string;
    arbeidsgiverAktørId?: string;
  };
  internArbeidsforholdRef?: string;
  eksternArbeidsforholdRef?: string;
  skalKunneFastsetteDelvisRefusjon: boolean;
  fastsattDelvisRefusjonPrMnd?: number;
  maksTillattDelvisRefusjonPrMnd?: number;
}>;

export type RefusjonTilVurdering = Readonly<{
  andeler: RefusjonTilVurderingAndel[];
}>;

export type PerioderMedGraderingEllerRefusjon = Readonly<{
  erRefusjon?: boolean;
  erGradering?: boolean;
  erSøktYtelse?: boolean;
  fom?: string;
  tom?: string;
}>;

export type ArbeidsforholdTilFordeling = Readonly<{
  aktørId?: number;
  arbeidsforholdId?: string;
  arbeidsgiverIdent?: string;
  arbeidsforholdType?: string;
  arbeidsgiverId?: string;
  arbeidsgiverNavn?: string;
  belopFraInntektsmeldingPrMnd?: number;
  eksternArbeidsforholdId?: string;
  naturalytelseBortfaltPrÅr?: number;
  naturalytelseTilkommetPrÅr?: number;
  opphoersdato?: string;
  organisasjonstype?: string;
  perioderMedGraderingEllerRefusjon?: PerioderMedGraderingEllerRefusjon[];
  permisjon?: {
    permisjonFom?: string;
    permisjonTom?: string;
  };
  refusjonPrAar?: number;
  startdato?: string;
}>;

export type FordelBeregningsgrunnlagAndel = Readonly<{
  aktivitetStatus?: string;
  andelIArbeid?: number[];
  andelsnr?: number;
  arbeidsforhold?: BeregningsgrunnlagArbeidsforhold;
  arbeidsforholdType?: string;
  belopFraInntektsmeldingPrAar?: number;
  fordelingForrigeBehandlingPrAar?: number;
  fordeltPrAar?: number;
  inntektskategori?: string;
  lagtTilAvSaksbehandler?: boolean;
  nyttArbeidsforhold?: boolean;
  refusjonskravFraInntektsmeldingPrAar?: number;
  refusjonskravPrAar?: number;
  kilde?: string;
}>;

export type FordelBeregningsgrunnlagPeriode = Readonly<{
  fom: string;
  fordelBeregningsgrunnlagAndeler?: FordelBeregningsgrunnlagAndel[];
  skalRedigereInntekt?: boolean;
  skalPreutfyllesMedBeregningsgrunnlag?: boolean;
  skalKunneEndreRefusjon?: boolean;
  tom?: string;
}>;

type FordelBeregningsgrunnlag = Readonly<{
  arbeidsforholdTilFordeling?: ArbeidsforholdTilFordeling[];
  fordelBeregningsgrunnlagPerioder?: FordelBeregningsgrunnlagPeriode[];
}>;

export type Inntektsforhold = Readonly<{
  aktivitetStatus: string;
  arbeidsforholdId: string;
  arbeidsgiverId: string;
  bruttoInntektPrÅr?: number;
  inntektFraInntektsmeldingPrÅr?: number;
  skalRedusereUtbetaling: boolean;
  periode?: {
    fom: string;
    tom: string;
  };
}>;

export type VurderInntektsforholdPeriode = Readonly<{
  fom: string;
  tom: string;
  inntektsforholdListe: Inntektsforhold[];
}>;

export type FaktaOmFordeling = Readonly<{
  fordelBeregningsgrunnlag?: FordelBeregningsgrunnlag;
  vurderNyttInntektsforholdDto?: {
    vurderInntektsforholdPerioder?: VurderInntektsforholdPeriode[];
    harMottattOmsorgsstønadEllerFosterhjemsgodtgjørelse: boolean;
  };
}>;
