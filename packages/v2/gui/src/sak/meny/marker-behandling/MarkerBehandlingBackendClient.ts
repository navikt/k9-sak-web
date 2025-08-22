import type {
  k9_kodeverk_produksjonsstyring_BehandlingMerknadType as BehandlingMerknadType,
  GetMerknadResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { los_deleteMerknad, los_getMerknad, los_postMerknad } from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export default class MarkerBehandlingBackendClient {
  async getMerknader(behandlingUuid: string): Promise<GetMerknadResponse> {
    return (await los_getMerknad({ query: { behandlingUuid } })).data;
  }

  async markerBehandling({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: BehandlingMerknadType;
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
    merknadKode: BehandlingMerknadType;
  }): Promise<void> {
    await los_deleteMerknad({
      body: {
        behandlingUuid,
        merknadKode,
      },
    });
  }
}
