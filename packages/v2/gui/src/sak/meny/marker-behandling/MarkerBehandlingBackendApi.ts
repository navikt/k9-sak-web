import type { MerknadResponse } from '@k9-sak-web/backend/k9sak/kontrakt/los/MerknadResponse.js';
import type { MerknadType } from '@k9-sak-web/backend/k9sak/kodeverk/produksjonsstyring/MerknadType.js';

export type MarkerBehandlingBackendApi = {
  getMerknader(behandlingUuid: string): Promise<MerknadResponse>;
  markerBehandling: ({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: MerknadType;
  }) => Promise<void>;

  fjernMerknad({ behandlingUuid, merknadKode }: { behandlingUuid: string; merknadKode: MerknadType }): Promise<void>;
};
