export type OverstyringUttakArbeidsforhold = {
  type: string | null;
  orgnr: string | null;
  aktørId: string | null;
  arbeidsforholdId: string | null;
};

export type OverstyringUttakUtbetalingsgrad = {
  arbeidsforhold: OverstyringUttakArbeidsforhold;
  utbetalingsgrad: string | number;
};

export type EnkeltOverstyringUttak = {
  periode: { fom: string; tom: string };
  begrunnelse: string; // denne mangler i backend?
  søkersUttaksgrad: string | number;
  utbetalingsgrader: OverstyringUttakUtbetalingsgrad[];
};

export type OverstyringUttakRequest = {
  periode: { fom: string; tom: string };
  erVilkarOk: boolean;
  begrunnelse: string;
  gåVidere: boolean;
  lagreEllerOppdater: EnkeltOverstyringUttak[];
  slett: { id: number | string }[];
};
