import type {
  K9SakClient,
  MerknadEndretDtoMerknadKode,
  PostMerknadResponse,
} from '@k9-sak-web/backend/k9sak/generated';

export default class MarkerBehandlingBackendClient {
  #backendClient: K9SakClient;

  constructor(backendClient: K9SakClient) {
    this.#backendClient = backendClient;
  }

  async markerBehandling({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst?: string;
    merknadKode?: MerknadEndretDtoMerknadKode;
  }): Promise<PostMerknadResponse> {
    return this.#backendClient.los.postMerknad({
      behandlingUuid,
      fritekst,
      merknadKode,
    });
  }
}
