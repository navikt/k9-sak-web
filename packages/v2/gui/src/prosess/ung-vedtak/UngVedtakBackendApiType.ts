import type { ForhåndsvisVedtaksbrevResponse } from '@k9-sak-web/backend/ungsak/tjenester/ForhåndsvisVedtaksbrevResponse.js';
import type { DokumentMalType } from '@k9-sak-web/backend/ungsak/kodeverk/dokument/DokumentMalType.js';
import type { VedtaksbrevEditorResponse } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/vedtaksbrev/editor/VedtaksbrevEditorResponse.js';
import type { VedtaksbrevValgRequest } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/vedtaksbrev/VedtaksbrevValgRequest.js';
import type { VedtaksbrevValgResponse } from '@k9-sak-web/backend/ungsak/tjenester/VedtaksbrevValgResponse.js';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(
    behandlingId: number,
    dokumentMalType: DokumentMalType,
    htmlVersjon?: boolean,
    redigertVersjon?: boolean,
  ): Promise<ForhåndsvisVedtaksbrevResponse>;
  vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse>;
  lagreVedtaksbrev(data: VedtaksbrevValgRequest): Promise<unknown>;
  formidling_editor(
    behandlingId: string,
    dokumentMalType: DokumentMalType,
  ): Promise<VedtaksbrevEditorResponse>;
};
