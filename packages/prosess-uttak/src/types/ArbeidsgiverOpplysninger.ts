export type ArbeidsgiverOpplysninger = Readonly<{
  navn: string;
  fødselsdato?: string;
  identifikator?: string;
  personIdentifikator?: string;
  arbeidsforholdreferanser?: {
    internArbeidsforholdId?: string;
    eksternArbeidsforholdId?: string;
  }[];
}>;

export default ArbeidsgiverOpplysninger;
