export type Månedsgrunnlag = Readonly<{
  fom: string;
  tom: string;
  inntekter: BesteberegningInntekt[];
}>;

export type BesteberegningInntekt = Readonly<{
  arbeidsgiverId?: string;
  arbeidsforholdId?: string;
  opptjeningAktivitetType: string;
  inntekt: number;
}>;

export type Besteberegninggrunnlag = Readonly<{
  besteMåneder: Månedsgrunnlag[];
}>;
