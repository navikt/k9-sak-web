import ArbeidsforholdPeriode from './ArbeidsforholdPeriode';

export interface Arbeidsforhold {
  arbeidsgiversArbeidsforholdId: string;
  perioder: ArbeidsforholdPeriode[];
}

export default ArbeidsforholdPeriode;
