import {
  EndreMerknadRequestMerknadKode,
  SlettMerknadRequestMerknadKode,
  type DeleteMerknadResponse,
  type GetMerknadResponse,
  type PostMerknadResponse,
} from '@k9-sak-web/backend/k9sak/generated';

export type MarkerBehandlingBackendApiType = {
  getMerknader(behandlingUuid: string): Promise<GetMerknadResponse>;
  markerBehandling: ({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: EndreMerknadRequestMerknadKode;
  }) => Promise<PostMerknadResponse>;

  fjernMerknad({
    behandlingUuid,
    merknadKode,
  }: {
    behandlingUuid: string;
    merknadKode: SlettMerknadRequestMerknadKode;
  }): Promise<DeleteMerknadResponse>;
};
