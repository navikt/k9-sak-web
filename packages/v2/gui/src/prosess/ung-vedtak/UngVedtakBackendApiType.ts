import type { ForhåndsvisVedtaksbrevResponse, VedtaksbrevValgResponse } from '@k9-sak-web/backend/ungsak/generated';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(behandlingUuid: number): Promise<ForhåndsvisVedtaksbrevResponse>;
  vedtaksbrevValg(behandlingUuid: number): Promise<VedtaksbrevValgResponse>;
};
