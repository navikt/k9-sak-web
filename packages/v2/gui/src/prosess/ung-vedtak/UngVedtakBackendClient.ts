import type {
  ForhåndsvisVedtaksbrevResponse,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import {
  formidling_forhåndsvisVedtaksbrev,
  formidling_vedtaksbrevValg,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';

export default class UngVedtakBackendClient {
  async forhåndsvisVedtaksbrev(behandlingId: number): Promise<ForhåndsvisVedtaksbrevResponse> {
    return (await formidling_forhåndsvisVedtaksbrev({ body: { behandlingId } })).data;
  }

  async vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse> {
    return (await formidling_vedtaksbrevValg({ query: { behandlingId: `${behandlingId}` } })).data;
  }
}
