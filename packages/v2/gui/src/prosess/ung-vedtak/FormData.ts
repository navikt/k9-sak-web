import type { ung_kodeverk_dokument_DokumentMalType } from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface FormData {
  vedtaksbrevValg: {
    redigerAutomatiskBrev: boolean;
    hindreUtsendingAvBrev: boolean;
    redigertHtml: string;
    originalHtml: string;
    dokumentMalType?: ung_kodeverk_dokument_DokumentMalType | undefined;
  }[];
}
