import type { ForhåndsvisVedtaksbrevResponse, UngSakClient } from '@k9-sak-web/backend/ungsak/generated';
import axios from 'axios';

export default class UngVedtakBackendClient {
  #ungsak: UngSakClient;

  constructor(ungsakClient: UngSakClient) {
    this.#ungsak = ungsakClient;
  }

  async forhåndsvisVedtaksbrev(behandlingId: number): Promise<ForhåndsvisVedtaksbrevResponse> {
    // return this.#ungsak.formidling.forhåndsvisVedtaksbrev({ behandlingId });
    return axios.post(
      'http://localhost:9005/ung/sak/api/formidling/vedtaksbrev/forhaandsvis',
      { behandlingId },
      {
        headers: {
          Accept: 'application/pdf',
        },
        responseType: 'blob'
      },
    );
  }
}
