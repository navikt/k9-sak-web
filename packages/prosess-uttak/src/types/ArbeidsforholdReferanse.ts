export type ArbeidsforholdReferanse = {
  identifikator: string | null;
  personIdentifikator: string | null;
  navn: string;
  fødselsdato: string | null;
  arbeidsforholdreferanser: [
    {
      internArbeidsforholdId: string;
      eksternArbeidsforholdId: string;
    },
  ];
};
