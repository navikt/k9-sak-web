export type OverstyringUttakArbeidsforhold = {
  type: string | null;
  organisasjonsnummer: string | null;
  aktørId: string | null;
  arbeidsforholdId: string | null;
};

export type OverstyringUttakUtbetalingsgrad = {
  arbeidsforhold: OverstyringUttakArbeidsforhold;
  utbetalingsgrad: string;
};

export type EnkeltOverstyringUttak = {
  periode: { fom: string; tom: string };
  lagreEllerOppdater: {
    erVilkarOk: boolean;
    begrunnelse: string;
    periode: { fom: string; tom: string };
    søkersUttaksgrad: string;
    utbetalingsgrader: OverstyringUttakUtbetalingsgrad[];
  };
};

export type OverstyringUttakRequest = {
  '@type@': string;
  periode: { fom?: string; tom?: string };
  erVilkarOk: boolean | undefined;
  avslagsDato: string | undefined;
  avslagskode: string | undefined;
  lagreEllerOppdater: EnkeltOverstyringUttak[];
  slett: [{ id: number | string }][];
};
