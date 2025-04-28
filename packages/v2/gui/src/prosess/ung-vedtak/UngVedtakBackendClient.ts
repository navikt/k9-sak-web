import type {
  ForhåndsvisVedtaksbrevResponse,
  LagreVedtaksbrevValgResponse,
  UngSakClient,
  VedtaksbrevValgRequestDto,
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

  async lagreVedtaksbrev(data: VedtaksbrevValgRequestDto): Promise<LagreVedtaksbrevValgResponse> {
    return this.#ungsak.formidling.lagreVedtaksbrevValg(data);
  }

  async vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse> {
    return this.#ungsak.formidling.vedtaksbrevValg(`${behandlingId}`);
  }
}
