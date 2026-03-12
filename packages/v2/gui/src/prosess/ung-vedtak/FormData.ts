import type { ung_kodeverk_dokument_DokumentMalType } from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface FormData {
  vedtaksbrevValg: {
    redigertHtml: string;
    originalHtml: string;
    dokumentMalType?: ung_kodeverk_dokument_DokumentMalType | undefined;
  }[];
}
