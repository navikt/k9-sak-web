import type { ForhåndsvisVedtaksbrevResponse } from '@k9-sak-web/backend/ungsak/generated';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(behandlingUuid: number): Promise<ForhåndsvisVedtaksbrevResponse>;
};
