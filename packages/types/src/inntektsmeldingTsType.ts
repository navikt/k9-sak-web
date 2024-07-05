export type Inntektsmelding = Readonly<{
  journalpostId?: string;
  mottattTidspunkt?: string;
  status?: string;
  begrunnelse?: string;
}>;

export default Inntektsmelding;
