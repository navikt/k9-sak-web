import type {
  ForhåndsvisVedtaksbrevResponse,
  TilgjengeligeVedtaksbrevResponse,
} from '@k9-sak-web/backend/ungsak/generated';

export type UngVedtakBackendApiType = {
  forhåndsvisVedtaksbrev(behandlingUuid: number): Promise<ForhåndsvisVedtaksbrevResponse>;
  tilgjengeligeVedtaksbrev(behandlingUuid: number): Promise<TilgjengeligeVedtaksbrevResponse>;
};
