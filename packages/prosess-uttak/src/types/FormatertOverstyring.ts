export type FormatertOverstyring = {
  id?: string;
  begrunnelse: string;
  periode: {
    fom: string;
    tom: string;
  };
  søkersUttaksgrad: number | string;
  utbetalingsgrader: {
    arbeidsforhold: {
      type: string;
      orgnr: string;
      aktørId: string;
      arbeidsforholdId: string;
    };
    utbetalingsgrad: number;
  }[];
};
