export type OverstyringUttak = {
  id: string;
  periode: {
    fom: Date;
    tom: Date;
  };
  søkersUttaksgrad: number;
  utbetalingsgrader: {
    arbeidsforhold: {
      type: string;
      organisasjonsnummer: string | null;
      aktørId: string | null;
      arbeidsforholdId: string | null;
    };
    utbetalingsgrad: number;
  }[];
  begrunnelse: string;
};
