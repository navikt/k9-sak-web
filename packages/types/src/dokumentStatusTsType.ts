export type DokumentStatus = Readonly<{
  type: string;
  status: [
    {
      periode: { fom: string; tom: string };
      status: { kode: string; kodeverk: string };
    },
  ];
  innsendingstidspunkt: string;
  journalpostId: string;
  avklarteOpplysninger?: {
    godkjent: boolean;
    begrunnelse: string;
    fraDato: string;
  };
  overstyrteOpplysninger?: {
    godkjent: boolean;
    begrunnelse: string;
    fraDato: string;
  };
}>;

export default DokumentStatus;
