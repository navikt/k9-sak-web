import type { ForhåndsvisVedtaksbrevResponse } from '@k9-sak-web/backend/ungsak/tjenester/ForhåndsvisVedtaksbrevResponse.js';
import type { LagreVedtaksbrevValgResponses } from '@k9-sak-web/backend/ungsak/kontrakt/LagreVedtaksbrevValgResponses.js';
import type { VedtaksbrevEditorResponse } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/vedtaksbrev/editor/VedtaksbrevEditorResponse.js';
import type { VedtaksbrevValgResponse } from '@k9-sak-web/backend/ungsak/tjenester/VedtaksbrevValgResponse.js';

import { fakePdf } from './fakePdf.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';

export class FakeUngVedtakBackendApi {
  async forhåndsvisVedtaksbrev(): Promise<ForhåndsvisVedtaksbrevResponse> {
    return fakePdf();
  }

  async vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse> {
    ignoreUnusedDeclared(behandlingId);
    return { harBrev: true };
  }

  async lagreVedtaksbrev(): Promise<LagreVedtaksbrevValgResponses> {
    return { 200: {} };
  }

  async formidling_editor(): Promise<VedtaksbrevEditorResponse> {
    return {};
  }
}
