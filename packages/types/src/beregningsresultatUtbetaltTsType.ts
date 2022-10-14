export type BeregningsresultatPeriodeAndel = Readonly<{
  arbeidsgiverNavn: string;
  arbeidsgiverOrgnr: string;
  refusjon: number;
  tilSoker: number;
  uttak: any[];
  utbetalingsgrad: number;
  sisteUtbetalingsdato: string;
  aktivitetStatus: string;
  arbeidsforholdId: string;
  eksternArbeidsforholdId: string;
  aktørId: string;
  arbeidsforholdType: string;
  stillingsprosent: number;
}>;

export type BeregningsresultatUtbetalt = Readonly<{
  opphoersdato?: string;
  perioder: {
    andeler: any[];
    dagsats: number;
    fom: string;
    tom: string;
  }[];
  skalHindreTilbaketrekk: boolean;
  utbetaltePerioder: any[];
}>;

export type BeregningsresultatPeriode = Readonly<{
  fom: string;
  tom: string;
  dagsats: number;
  andeler?: BeregningsresultatPeriodeAndel[];
}>;

export default BeregningsresultatUtbetalt;
