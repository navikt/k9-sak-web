import type {
  ForhåndsvisVedtaksbrevResponse,
  ung_kodeverk_dokument_DokumentMalType,
  ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevEditorResponse,
  ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(
    behandlingId: number,
    dokumentMalType: ung_kodeverk_dokument_DokumentMalType,
    htmlVersjon?: boolean,
    redigertVersjon?: boolean,
  ): Promise<ForhåndsvisVedtaksbrevResponse>;
  vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse>;
  lagreVedtaksbrev(data: ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest): Promise<unknown>;
  formidling_editor(
    behandlingId: string,
    dokumentMalType: ung_kodeverk_dokument_DokumentMalType,
  ): Promise<ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevEditorResponse>;
};
