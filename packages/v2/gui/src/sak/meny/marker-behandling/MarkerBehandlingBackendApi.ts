import { BehandlingMerknadKode as EndreMerknadRequestMerknadKode, BehandlingMerknadKode as SlettMerknadRequestMerknadKode } from '@k9-sak-web/backend/k9sak/kodeverk/produksjonsstyring/BehandlingMerknadKode.js';
import type { GetMerknadResponse } from '@k9-sak-web/backend/k9sak/tjenester/GetMerknadResponse.js';

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
