import Kodeverk from './kodeverkTsType';

type BeregningsgrunnlagArbeidsforhold = Readonly<{
  arbeidsgiverIdent?: string;
  arbeidsgiverId?: string;
  startdato?: string;
  opphoersdato?: string;
  arbeidsforholdId?: string;
  arbeidsforholdType?: Kodeverk;
}>;

type FaktaOmBeregningAndel = Readonly<{
  arbeidsforhold?: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  inntektskategori?: Kodeverk;
  aktivitetStatus?: Kodeverk;
}>;

type AndelForFaktaOmBeregning = Readonly<{
  arbeidsforhold: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  inntektskategori?: Kodeverk;
  aktivitetStatus?: Kodeverk;
  belopReadOnly?: number;
  fastsattBelop?: number;
  skalKunneEndreAktivitet: boolean;
  lagtTilAvSaksbehandler: boolean;
}>;

type RefusjonskravSomKommerForSentListe = Readonly<{
  arbeidsgiverId: string;
  arbeidsgiverVisningsnavn: string;
  erRefusjonskravGyldig?: boolean;
}>;

type VurderMilitaer = Readonly<{
  harMilitaer?: boolean;
}>;

type AvklarAktiviteter = Readonly<{
  aktiviteterTomDatoMapping?: {
    tom: string;
    aktiviteter: {
      arbeidsgiverIdent?: string;
      arbeidsgiverId?: string;
      eksternArbeidsforholdId?: string;
      fom: string;
      tom?: string;
      arbeidsforholdId?: string;
      arbeidsforholdType: Kodeverk;
      aktørIdString?: string;
    }[];
  }[];
}>;

type FaktaOmBeregning = Readonly<{
  beregningsgrunnlagArbeidsforhold?: (BeregningsgrunnlagArbeidsforhold & {
    erTidsbegrensetArbeidsforhold?: boolean;
  })[];
  avklarAktiviteter?: AvklarAktiviteter;
  frilansAndel?: FaktaOmBeregningAndel;
  vurderMilitaer?: VurderMilitaer;
  refusjonskravSomKommerForSentListe?: RefusjonskravSomKommerForSentListe[];
  arbeidsforholdMedLønnsendringUtenIM?: FaktaOmBeregningAndel[];
  andelerForFaktaOmBeregning: AndelForFaktaOmBeregning[];
}>;

export type Beregningsgrunnlag = Readonly<{
  aktivitetStatus?: {
    aktivitetStatus: Kodeverk;
  }[];
  beregningsgrunnlagPeriode?: {
    beregningsgrunnlagPrStatusOgAndel?: {
      aktivitetStatus?: Kodeverk;
      arbeidsforholdType?: Kodeverk;
      beregnetPrAar?: number;
      arbeidsforholdId?: string;
      erNyIArbeidslivet?: boolean;
      erTidsbegrensetArbeidsforhold?: boolean;
      erNyoppstartet?: boolean;
      arbeidsgiverId?: string;
      andelsnr?: number;
      lonnsendringIBeregningsperioden?: boolean;
    }[];
  }[];
  faktaOmBeregning: FaktaOmBeregning;
}>;

export default Beregningsgrunnlag;
