import type { KravDokumentStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/KravDokumentStatus.js';
import type { SøknadsfristPeriode } from './SøknadsfristPeriode';

type AvklarteOpplysninger = {
  begrunnelse?: string;
  fraDato: string;
  godkjent: boolean;
  opprettetAv?: string;
  opprettetTidspunkt?: string;
};

export type KravDokument = {
  avklarteOpplysninger?: AvklarteOpplysninger;
  innsendingstidspunkt: string;
  journalpostId: string;
  overstyrteOpplysninger?: AvklarteOpplysninger;
  status: Array<SøknadsfristPeriode>;
  type?: KravDokumentStatusType;
  id?: string;
};
