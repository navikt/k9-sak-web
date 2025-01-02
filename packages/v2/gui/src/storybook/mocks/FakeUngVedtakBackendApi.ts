import type { ForhåndsvisVedtaksbrevResponse } from '@k9-sak-web/backend/ungsak/generated';

export class FakeUngVedtakBackendApi {
  async forhåndsvisVedtaksbrev(): Promise<ForhåndsvisVedtaksbrevResponse> {
    return;
  }
}
