export type FormatertOverstyring = {
  id?: string;
  begrunnelse?: string;
  periode: {
    fom: string;
    tom: string;
  };
  søkersUttaksgrad: number;
  utbetalingsgrader: {
    arbeidsforhold: {
      type: string;
      organisasjonsnummer: string;
      aktørId: string;
      arbeidsforholdId: string;
    };
    utbetalingsgrad: number;
  }[];
};
