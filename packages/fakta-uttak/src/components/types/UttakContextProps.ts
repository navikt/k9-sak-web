interface UttakContextProps {
  valgtArbeidsforholdId?: string;
  setValgtArbeidsforholdId?: (arbeidsforholdId: string) => void;
  valgtFomTom: string;
  setValgtFomTom: (fomTom: string) => void;
  redigererPeriode?: boolean;
  setRedigererPeriode?: (redigererPeriode: boolean) => void;
}

export default UttakContextProps;
