import type { ForhåndsvisVedtaksbrevResponse } from '@k9-sak-web/backend/ungsak/generated';
import { fakePdf } from './fakePdf.js';

export class FakeUngVedtakBackendApi {
  async forhåndsvisVedtaksbrev(): Promise<ForhåndsvisVedtaksbrevResponse> {
    return fakePdf();
  }
}
