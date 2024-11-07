import type { Kommunikasjonsretning } from '@k9-sak-web/backend/k9sak/kodeverk/Kommunikasjonsretning.js';

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
