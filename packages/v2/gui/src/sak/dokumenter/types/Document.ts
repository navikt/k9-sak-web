import type { k9_kodeverk_dokument_Kommunikasjonsretning as Kommunikasjonsretning } from '@k9-sak-web/backend/k9sak/generated';

export type Document = {
  behandlinger?: Array<number>;
  brevkode?: string;
  dokumentId?: string;
  gjelderFor?: string;
  journalpostId?: string;
  kommunikasjonsretning?: Kommunikasjonsretning;
  tidspunkt?: string;
  tittel?: string;
};
