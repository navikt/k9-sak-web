import type {
  ForhåndsvisVedtaksbrevResponse,
  LagreVedtaksbrevValgResponses,
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
    return { vedtaksbrevValg: {} };
  }
}
