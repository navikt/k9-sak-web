export type InnsynDokument = Readonly<{
  journalpostId: string;
  dokumentId: string;
  fikkInnsyn: boolean;
}>;

export type InnsynVedtaksdokument = Readonly<{
  dokumentId: string;
  tittel: string;
  opprettetDato: string;
}>;

export type Innsyn = Readonly<{
  innsynMottattDato: string;
  innsynResultatType: string;
  vedtaksdokumentasjon: InnsynVedtaksdokument[];
  dokumenter: InnsynDokument[];
}>;

export default Innsyn;
