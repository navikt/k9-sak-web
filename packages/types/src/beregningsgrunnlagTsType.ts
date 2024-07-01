type BeregningsgrunnlagArbeidsforhold = Readonly<{
  arbeidsgiverIdent?: string;
  arbeidsgiverId?: string;
  startdato?: string;
  opphoersdato?: string;
  arbeidsforholdId?: string;
  arbeidsforholdType?: string;
}>;

type FaktaOmBeregningAndel = Readonly<{
  arbeidsforhold?: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  inntektskategori?: string;
  aktivitetStatus?: string;
}>;

type AndelForFaktaOmBeregning = Readonly<{
  arbeidsforhold: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  inntektskategori?: string;
  aktivitetStatus?: string;
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
      arbeidsforholdType: string;
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
    aktivitetStatus: string;
  }[];
  beregningsgrunnlagPeriode?: {
    beregningsgrunnlagPrStatusOgAndel?: {
      aktivitetStatus?: string;
      arbeidsforholdType?: string;
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
