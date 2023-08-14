export type DokumentStatus = Readonly<{
  type: string;
  status: Array<{
    periode: { fom: string; tom: string };
    status: { kode: string; kodeverk: string };
  }>;
  innsendingstidspunkt: string;
  journalpostId: string;
  avklarteOpplysninger?: {
    godkjent: boolean;
    begrunnelse: string;
    fraDato: string;
    opprettetAv: string;
    opprettetTidspunkt: string;
  };
  overstyrteOpplysninger?: {
    godkjent: boolean;
    begrunnelse: string;
    fraDato: string;
  };
}>;

export default DokumentStatus;
