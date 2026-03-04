import type { DokumentMalType } from '@k9-sak-web/backend/ungsak/kodeverk/dokument/DokumentMalType.js';

export interface FormData {
  vedtaksbrevValg: {
    redigertHtml: string;
    originalHtml: string;
    dokumentMalType?: DokumentMalType | undefined;
  }[];
}
