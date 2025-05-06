import type {
  ForhåndsvisVedtaksbrevResponse,
  LagreVedtaksbrevValgResponse,
  VedtaksbrevValgRequestDto,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(behandlingId: number, htmlVersjon?: boolean): Promise<ForhåndsvisVedtaksbrevResponse>;
  vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse>;
  lagreVedtaksbrev(data: VedtaksbrevValgRequestDto): Promise<LagreVedtaksbrevValgResponse>;
};
