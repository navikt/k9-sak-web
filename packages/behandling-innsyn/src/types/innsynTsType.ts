import { Kodeverk } from '@k9-sak-web/types';

type Innsyn = Readonly<{
  dokumenter: {
    journalpostId: string;
    dokumentId: string;
    tidspunkt: string;
  }[];
  innsynMottattDato: string;
  innsynResultatType: string;
  vedtaksdokumentasjon: {
    dokumentId: string;
    tittel: string;
    opprettetDato: string;
  };
}>;

export default Innsyn;
