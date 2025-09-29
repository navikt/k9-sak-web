import type {
  ForhåndsvisVedtaksbrevResponse,
  ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest,
  ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgResponse,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(behandlingId: number, htmlVersjon?: boolean): Promise<ForhåndsvisVedtaksbrevResponse>;
  vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse>;
  lagreVedtaksbrev(
    data: ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgRequest,
  ): Promise<ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValgResponse>;
};
