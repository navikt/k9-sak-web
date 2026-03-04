import {
  formidlingEditor,
  forhåndsvisVedtaksbrev,
  lagreVedtaksbrevValg,
  hentVedtaksbrevValg,
} from '@k9-sak-web/backend/ungsak/sdk.js';
import type { ForhåndsvisVedtaksbrevResponse } from '@k9-sak-web/backend/ungsak/tjenester/ForhåndsvisVedtaksbrevResponse.js';
import type { DokumentMalType } from '@k9-sak-web/backend/ungsak/kodeverk/dokument/DokumentMalType.js';
import type { VedtaksbrevValgRequest } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/vedtaksbrev/VedtaksbrevValgRequest.js';
import type { VedtaksbrevValgResponse } from '@k9-sak-web/backend/ungsak/tjenester/VedtaksbrevValgResponse.js';

export default class UngVedtakBackendClient {
  async lagreVedtaksbrev(data: VedtaksbrevValgRequest) {
    return (await lagreVedtaksbrevValg({ body: data })).data;
  }
  async forhåndsvisVedtaksbrev(
    behandlingId: number,
    dokumentMalType: DokumentMalType,
    htmlVersjon: boolean,
    redigertVersjon?: boolean,
  ): Promise<ForhåndsvisVedtaksbrevResponse> {
    return (
      await forhåndsvisVedtaksbrev({ body: { behandlingId, htmlVersjon, redigertVersjon, dokumentMalType } })
    ).data;
  }

  async vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse> {
    return (await hentVedtaksbrevValg({ query: { behandlingId: `${behandlingId}` } })).data;
  }

  async hentBrevEditor(behandlingId: string, dokumentMalType: DokumentMalType) {
    return (await formidlingEditor({ query: { behandlingId, dokumentMalType } })).data;
  }
}
