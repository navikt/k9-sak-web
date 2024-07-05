export type OpptjeningAktivitet = Readonly<{
  aktivitetType: string;
  arbeidsforholdRef: string;
  arbeidsgiver: string;
  arbeidsgiverIdentifikator: string;
  arbeidsgiverNavn: string;
  begrunnelse: string;
  beskrivelse?: string;
  erEndret: boolean;
  erGodkjent: boolean;
  erManueltOpprettet: boolean;
  id: number;
  naringRegistreringsdato: string;
  omsorgsovertakelseDato: string;
  oppdragsgiverOrg: string;
  opptjeningFom: string;
  opptjeningTom: string;
  originalFom: string;
  originalTom: string;
  privatpersonFødselsdato: string;
  privatpersonNavn: string;
  stillingsandel: number;
}>;

export default OpptjeningAktivitet;
