export type BeregningsresultatPeriodeAndel = Readonly<{
  arbeidsgiverNavn: string;
  arbeidsgiverOrgnr: string;
  refusjon: number;
  tilSoker: number;
  uttak: any[];
  utbetalingsgrad: number;
  sisteUtbetalingsdato: string;
  aktivitetStatus: string;
  inntektskategori: string;
  arbeidsforholdId: string;
  eksternArbeidsforholdId: string;
  aktørId: string;
  arbeidsforholdType: string;
  stillingsprosent: number;
}>;

export type BeregningsresultatPeriode = Readonly<{
  fom: string;
  tom: string;
  dagsats: number;
  andeler?: BeregningsresultatPeriodeAndel[];
  totalUtbetalingsgradFraUttak: number;
  totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt?: number;
}>;

export type BeregningsresultatUtbetalt = Readonly<{
  opphoersdato?: string;
  perioder: BeregningsresultatPeriode[];
  skalHindreTilbaketrekk: boolean;
  utbetaltePerioder: any[];
}>;

export default BeregningsresultatUtbetalt;
