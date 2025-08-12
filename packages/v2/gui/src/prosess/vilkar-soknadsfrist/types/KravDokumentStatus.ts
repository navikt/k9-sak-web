import type { k9_sak_kontrakt_krav_KravDokumentType as KravDokumentType } from '@k9-sak-web/backend/k9sak/generated';
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
  type?: KravDokumentType;
  id?: string;
};
