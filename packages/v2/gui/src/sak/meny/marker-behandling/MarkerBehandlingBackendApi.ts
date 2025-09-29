import {
  k9_kodeverk_produksjonsstyring_BehandlingMerknadType as EndreMerknadRequestMerknadKode,
  k9_kodeverk_produksjonsstyring_BehandlingMerknadType as SlettMerknadRequestMerknadKode,
  type GetMerknadResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export type MarkerBehandlingBackendApi = {
  getMerknader(behandlingUuid: string): Promise<GetMerknadResponse>;
  markerBehandling: ({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: EndreMerknadRequestMerknadKode;
  }) => Promise<void>;

  fjernMerknad({
    behandlingUuid,
    merknadKode,
  }: {
    behandlingUuid: string;
    merknadKode: SlettMerknadRequestMerknadKode;
  }): Promise<void>;
};
