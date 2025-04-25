import type {
  ForhåndsvisVedtaksbrevResponse,
  UngSakClient,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated';

export default class UngVedtakBackendClient {
  #ungsak: UngSakClient;

  constructor(ungsakClient: UngSakClient) {
    this.#ungsak = ungsakClient;
  }

  async forhåndsvisVedtaksbrev(behandlingId: number): Promise<ForhåndsvisVedtaksbrevResponse> {
    return this.#ungsak.formidling.forhåndsvisVedtaksbrev({ behandlingId });
  }

  async vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse> {
    return this.#ungsak.formidling.vedtaksbrevValg(`${behandlingId}`);
  }
}
