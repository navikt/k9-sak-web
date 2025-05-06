export type OpptjeningAktivitet = Readonly<{
  aktivitetType: string;
  erEndring: boolean;
  arbeidsgiverNavn: string;
  orgnr: string;
  godkjent: boolean;
  privatpersonFødselsdato?: string;
}>;
