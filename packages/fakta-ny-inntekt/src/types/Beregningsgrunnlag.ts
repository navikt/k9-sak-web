import type { BeregningAvklaringsbehov } from './BeregningAvklaringsbehov';
import type { BeregningsgrunnlagArbeidsforhold } from './BeregningsgrunnlagArbeidsforhold';
import type { FaktaOmBeregning } from './BeregningsgrunnlagFakta.js';
import type { FaktaOmFordeling, RefusjonTilVurdering } from './BeregningsgrunnlagFordeling';
import type { Besteberegninggrunnlag } from './Besteberegning.js';

export type InntektsgrunnlagInntekt = Readonly<{
  inntektAktivitetType: string;
  beløp: number;
}>;

export type InntektsgrunnlagMåned = Readonly<{
  fom: string;
  tom: string;
  inntekter: InntektsgrunnlagInntekt[];
}>;

export type PGIGrunnlag = Readonly<{
  pgiType: string;
  beløp: number;
}>;

export type PGIPrÅr = Readonly<{
  år: number;
  inntekter: PGIGrunnlag[];
}>;

export type Inntektsgrunnlag = Readonly<{
  måneder: InntektsgrunnlagMåned[];
  pgiGrunnlag: PGIPrÅr[];
}>;

export type Næring = Readonly<{
  orgnr: string;
  virksomhetType: string;
  utenlandskvirksomhetsnavn?: string;
  erVarigEndret?: boolean;
  erNyoppstartet?: boolean;
  begrunnelse?: string;
  endringsdato?: string;
  opphørsdato?: string;
  oppstartsdato?: string;
  regnskapsførerNavn?: string;
  regnskapsførerTlf?: string;
  kanRegnskapsførerKontaktes?: boolean;
  erNyIArbeidslivet?: boolean;
  oppgittInntekt?: number;
}>;

export type PgiVerdier = Readonly<{
  beløp: number;
  årstall: number;
}>;

export type BeregningsgrunnlagAndel = Readonly<{
  aktivitetStatus: string;
  arbeidsforholdType?: string;
  arbeidsforhold?: BeregningsgrunnlagArbeidsforhold;
  avkortetPrAar?: number;
  inntektskategori?: string;
  beregnetPrAar?: number;
  beregningsperiodeFom?: string;
  beregningsperiodeTom?: string;
  bruttoPrAar?: number;
  overstyrtPrAar?: number;
  redusertPrAar?: number;
  pgiSnitt?: number;
  pgiVerdier?: PgiVerdier[];
  aarsbeloepFraTilstoetendeYtelse?: number;
  erNyIArbeidslivet?: boolean;
  erTidsbegrensetArbeidsforhold?: boolean;
  erNyoppstartet?: boolean;
  andelsnr: number;
  lonnsendringIBeregningsperioden?: boolean;
  besteberegningPrAar?: number;
  skalFastsetteGrunnlag?: boolean;
  lagtTilAvSaksbehandler?: boolean;
  erTilkommetAndel?: boolean;
  næringer?: Næring[];
}>;

export type ForeldrepengerGrunnlag = Readonly<{
  besteberegninggrunnlag?: Besteberegninggrunnlag;
}>;

export type YtelseGrunnlag = Readonly<{
  ytelsetype: string;
}> &
  ForeldrepengerGrunnlag;

export type SammenligningsgrunlagProp = Readonly<{
  sammenligningsgrunnlagType: string;
  differanseBeregnet: number;
  avvikProsent: number;
  avvikPromille: number;
  rapportertPrAar: number;
  sammenligningsgrunnlagFom: string;
  sammenligningsgrunnlagTom: string;
}>;

export type BeregningsgrunnlagPeriodeProp = Readonly<{
  avkortetPrAar?: number;
  beregnetPrAar?: number;
  beregningsgrunnlagPeriodeFom: string;
  beregningsgrunnlagPeriodeTom: string;
  bruttoInkludertBortfaltNaturalytelsePrAar?: number;
  bruttoPrAar?: number;
  dagsats?: number;
  ledetekstAvkortet?: string;
  ledetekstBrutto?: string;
  ledetekstRedusert?: string;
  overstyrtPrAar?: number;
  redusertPrAar?: number;
  periodeAarsaker?: string[];
  beregningsgrunnlagPrStatusOgAndel?: BeregningsgrunnlagAndel[];
}>;

export type ForlengelsePeriodeProp = Readonly<{
  fom: string;
  tom: string;
}>;

export type Beregningsgrunnlag = Readonly<{
  vilkårsperiodeFom: string;
  avklaringsbehov: BeregningAvklaringsbehov[];
  skjaeringstidspunktBeregning: string;
  dekningsgrad: number;
  grunnbeløp: number;
  erOverstyrtInntekt: boolean;
  aktivitetStatus?: string[];
  beregningsgrunnlagPeriode: BeregningsgrunnlagPeriodeProp[];
  sammenligningsgrunnlagPrStatus?: SammenligningsgrunlagProp[];
  faktaOmBeregning?: FaktaOmBeregning;
  faktaOmFordeling?: FaktaOmFordeling;
  ytelsesspesifiktGrunnlag?: YtelseGrunnlag;
  refusjonTilVurdering?: RefusjonTilVurdering;
  inntektsgrunnlag?: Inntektsgrunnlag;
  forlengelseperioder?: ForlengelsePeriodeProp[];
}>;
