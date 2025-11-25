import type {
  ForhåndsvisVedtaksbrevResponse,
  LagreVedtaksbrevValgResponses,
  ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevEditorResponse,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

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

  async formidling_editor(): Promise<ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevEditorResponse> {
    return {};
  }
}
