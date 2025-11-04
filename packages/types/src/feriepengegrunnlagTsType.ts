export type FeriepengegrunnlagAndel = Readonly<{
  opptjeningsår: number;
  aktivitetStatus: string;
  arbeidsgiverId?: string;
  arbeidsforholdId?: string;
  erBrukerMottaker: boolean;
  årsbeløp: number;
}>;

export type Feriepengegrunnlag = Readonly<{
  andeler: FeriepengegrunnlagAndel[];
}>;
