import type {
  ForhåndsvisVedtaksbrevResponse,
  LagreVedtaksbrevValgResponse,
  VedtaksbrevValgRequestDto,
  VedtaksbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(behandlingUuid: number, htmlVersjon?: boolean): Promise<ForhåndsvisVedtaksbrevResponse>;
  vedtaksbrevValg(behandlingUuid: number): Promise<VedtaksbrevValgResponse>;
  lagreVedtaksbrev(data: VedtaksbrevValgRequestDto): Promise<LagreVedtaksbrevValgResponse>;
};
