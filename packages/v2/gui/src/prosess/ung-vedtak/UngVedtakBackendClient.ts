import {
  formidling_editor,
  formidling_forhåndsvisVedtaksbrev,
  formidling_lagreVedtaksbrevValg,
  formidling_vedtaksbrevValg,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type {
  ForhåndsvisVedtaksbrevResponse,
  ung_kodeverk_dokument_DokumentMalType,
  ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export default class UngVedtakBackendClient {
  async lagreVedtaksbrev(data: ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest) {
    return (await formidling_lagreVedtaksbrevValg({ body: data })).data;
  }
  async forhåndsvisVedtaksbrev(
    behandlingId: number,
    dokumentMalType: ung_kodeverk_dokument_DokumentMalType,
    htmlVersjon: boolean,
    redigertVersjon?: boolean,
  ): Promise<ForhåndsvisVedtaksbrevResponse> {
    return (
      await formidling_forhåndsvisVedtaksbrev({ body: { behandlingId, htmlVersjon, redigertVersjon, dokumentMalType } })
    ).data;
  }

  async vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse> {
    return (await formidling_vedtaksbrevValg({ query: { behandlingId: `${behandlingId}` } })).data;
  }

  async formidling_editor(behandlingId: string, dokumentMalType: ung_kodeverk_dokument_DokumentMalType) {
    return (await formidling_editor({ query: { behandlingId, dokumentMalType } })).data;
  }
}
