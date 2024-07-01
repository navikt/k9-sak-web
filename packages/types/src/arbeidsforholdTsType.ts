export type ArbeidsforholdPermisjon = Readonly<{
  permisjonFom?: string;
  permisjonTom?: string;
  permisjonsprosent?: number;
  type?: string;
}>;

export type Arbeidsforhold = Readonly<{
  id?: string;
  arbeidsgiverReferanse: string;
  navn?: string;
  arbeidsgiverId?: string;
  arbeidsgiverIdentifikator?: string;
  arbeidsgiverIdentifiktorGUI?: string;
  arbeidsforholdId?: string;
  eksternArbeidsforholdId?: string;
  fomDato?: string;
  tomDato?: string;
  kilde: {
    navn?: string;
    kode: string;
  };
  mottattDatoInntektsmelding?: string;
  stillingsprosent?: number;
  brukArbeidsforholdet?: boolean;
  fortsettBehandlingUtenInntektsmelding?: boolean;
  erNyttArbeidsforhold?: boolean;
  erSlettet?: boolean;
  erstatterArbeidsforholdId?: string;
  harErsattetEttEllerFlere?: boolean;
  ikkeRegistrertIAaRegister?: boolean;
  tilVurdering?: boolean;
  vurderOmSkalErstattes?: boolean;
  erEndret?: boolean;
  brukMedJustertPeriode?: boolean;
  overstyrtTom?: string;
  lagtTilAvSaksbehandler?: boolean;
  basertPaInntektsmelding?: boolean;
  inntektMedTilBeregningsgrunnlag?: boolean;
  skjaeringstidspunkt?: string;
  begrunnelse?: string;
  permisjoner?: ArbeidsforholdPermisjon[];
  brukPermisjon?: boolean;
  kanOppretteNyttArbforFraIM?: boolean;
  harErstattetEttEllerFlere?: boolean;
}>;

export default Arbeidsforhold;
