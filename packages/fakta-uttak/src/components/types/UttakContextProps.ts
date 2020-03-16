interface UttakContextProps {
  valgtArbeidsforholdId?: string;
  setValgtArbeidsforholdId?: (arbeidsforholdId: string) => void;
  valgtPeriodeIndex: number;
  setValgtPeriodeIndex: (index: number) => void;
  redigererPeriode?: boolean;
  setRedigererPeriode?: (redigererPeriode: boolean) => void;
}

export default UttakContextProps;
