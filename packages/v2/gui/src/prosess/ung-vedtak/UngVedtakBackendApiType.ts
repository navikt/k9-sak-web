import type {
  ForhåndsvisVedtaksbrevResponse,
  LagreVedtaksbrevValgResponse,
  VedtaksbrevValgRequestDto,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(behandlingId: number): Promise<ForhåndsvisVedtaksbrevResponse>;
  vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse>;
  lagreVedtaksbrev(data: VedtaksbrevValgRequestDto): Promise<LagreVedtaksbrevValgResponse>;
};
