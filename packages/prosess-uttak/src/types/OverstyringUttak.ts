export type OverstyringUttak = {
  id: string;
  periode: {
    fom: Date;
    tom: Date;
  };
  saksbehandler: string;
  søkersUttaksgrad: number;
  utbetalingsgrader: {
    arbeidsforhold: {
      type: string;
      orgnr: string | null;
      aktørId: string | null;
      arbeidsforholdId: string | null;
    };
    utbetalingsgrad: number;
  }[];
  begrunnelse: string;
};
