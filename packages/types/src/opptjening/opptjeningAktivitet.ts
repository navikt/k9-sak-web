type OpptjeningAktivitet = Readonly<{
  aktivitetType: {
    kode: string;
  };
  arbeidsforholdRef: string;
  arbeidsgiver: string;
  arbeidsgiverIdentifikator: string;
  arbeidsgiverNavn: string;
  begrunnelse: string;
  beskrivelse?: string;
  erEndret: boolean;
  erGodkjent: boolean;
  erManueltOpprettet: boolean;
  erPeriodeEndret: boolean;
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
  vurderingÅrsak: { kode: string; kodeverk: string };
}>;

export default OpptjeningAktivitet;
