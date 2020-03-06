interface UttakContextProps {
  valgtArbeidsgiversOrgNr?: string;
  setValgtArbeidsgiversOrgNr?: (orgNr: string) => void;
  valgtArbeidsforholdId?: string;
  setValgtArbeidsforholdId?: (arbeidsforholdId: string) => void;
  valgtPeriodeIndex?: number;
  setValgtPeriodeIndex?: (periodeIndex: number) => void;
  redigererPeriode?: boolean;
  setRedigererPeriode: (redigererPeriode: boolean) => void;
}

export default UttakContextProps;
