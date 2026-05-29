import type { MerknadResponse } from '@k9-sak-web/backend/k9sak/kontrakt/los/MerknadResponse.js';
import type { MerknadType } from '@k9-sak-web/backend/k9sak/kodeverk/produksjonsstyring/MerknadType.js';
import {
  los_deleteMerknad,
  los_getMerknad,
  los_postMerknad,
} from '@k9-sak-web/backend/k9sak/tjenester/los/MerknadApi.js';

export default class MarkerBehandlingBackendClient {
  async getMerknader(behandlingUuid: string): Promise<MerknadResponse> {
    return (await los_getMerknad({ query: { behandlingUuid } })).data;
  }

  async markerBehandling({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: MerknadType;
  }): Promise<void> {
    await los_postMerknad({
      body: {
        behandlingUuid,
        fritekst,
        merknadKode,
      },
    });
  }

  async fjernMerknad({
    behandlingUuid,
    merknadKode,
  }: {
    behandlingUuid: string;
    merknadKode: MerknadType;
  }): Promise<void> {
    await los_deleteMerknad({
      body: {
        behandlingUuid,
        merknadKode,
      },
    });
  }
}
