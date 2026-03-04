import type { BehandlingMerknadKode as BehandlingMerknadType } from '@k9-sak-web/backend/k9sak/kodeverk/produksjonsstyring/BehandlingMerknadKode.js';
import type { GetMerknadResponse } from '@k9-sak-web/backend/k9sak/tjenester/GetMerknadResponse.js';
import { slettMerknad, getMerknad, opprettMerknad } from '@k9-sak-web/backend/k9sak/sdk.js';

export default class MarkerBehandlingBackendClient {
  async getMerknader(behandlingUuid: string): Promise<GetMerknadResponse> {
    return (await getMerknad({ query: { behandlingUuid } })).data;
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
    await opprettMerknad({
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
    await slettMerknad({
      body: {
        behandlingUuid,
        merknadKode,
      },
    });
  }
}
