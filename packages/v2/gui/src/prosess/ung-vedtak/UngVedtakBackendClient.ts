import {
  formidling_forhåndsvisVedtaksbrev,
  formidling_lagreVedtaksbrevValg,
  formidling_vedtaksbrevValg,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type {
  ForhåndsvisVedtaksbrevResponse,
  LagreVedtaksbrevValgResponses,
  ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export default class UngVedtakBackendClient {
  // async forhåndsvisVedtaksbrev(behandlingId: number, htmlVersjon?: boolean): Promise<ForhåndsvisVedtaksbrevResponse> {
  //   return this.#ungsak.formidling.forhåndsvisVedtaksbrev({ behandlingId, htmlVersjon });
  // }

  async lagreVedtaksbrev(
    data: ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest,
  ): Promise<LagreVedtaksbrevValgResponses> {
    return (await formidling_lagreVedtaksbrevValg({ body: data })).data;
  }
  async forhåndsvisVedtaksbrev(behandlingId: number, htmlVersjon?: boolean): Promise<ForhåndsvisVedtaksbrevResponse> {
    return (await formidling_forhåndsvisVedtaksbrev({ body: { behandlingId, htmlVersjon } })).data;
  }

  async vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse> {
    return (await formidling_vedtaksbrevValg({ query: { behandlingId: `${behandlingId}` } })).data;
  }
}
