export type AksjonspunktValues = {
  begrunnelse?: string;
  periode: {
    fom: string;
    tom: string;
  };
};

export type TilkommetInntektsforholdFieldValues = {
  aktivitetStatus: string;
  arbeidsgiverIdent?: string;
  arbeidsforholdId?: string;
  skalRedusereUtbetaling?: boolean;
  bruttoInntektPrÅr?: string;
};

export type TilkommetAktivitetValues = {
  fom: string;
  tom: string;
  inntektsforhold: TilkommetInntektsforholdFieldValues[];
};

export type TilkommetAktivitetPeriodeValuesMedPerioder = {
  perioder: TilkommetAktivitetValues[];
};

export type TilkommetAktivitetFieldValues = AksjonspunktValues &
  TilkommetAktivitetPeriodeValuesMedPerioder & {
    beregningsgrunnlagStp: string;
  };

export type TilkommetAktivitetFormValues = {
  [key: string]: TilkommetAktivitetFieldValues[];
};
