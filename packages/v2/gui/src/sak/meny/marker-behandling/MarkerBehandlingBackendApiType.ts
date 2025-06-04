import { MerknadEndretDtoMerknadKode, type PostMerknadResponse } from '@k9-sak-web/backend/k9sak/generated';

export type MarkerBehandlingBackendApiType = {
  markerBehandling: ({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst?: string;
    merknadKode?: MerknadEndretDtoMerknadKode;
  }) => Promise<PostMerknadResponse>;
};
