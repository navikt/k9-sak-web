import type {
  DeleteMerknadResponse,
  EndreMerknadRequestMerknadKode,
  GetMerknadResponse,
  K9SakClient,
  PostMerknadResponse,
  SlettMerknadRequestMerknadKode,
} from '@k9-sak-web/backend/k9sak/generated';

export default class MarkerBehandlingBackendClient {
  #backendClient: K9SakClient;

  constructor(backendClient: K9SakClient) {
    this.#backendClient = backendClient;
  }

  async getMerknader(behandlingUuid: string): Promise<GetMerknadResponse> {
    return this.#backendClient.los.getMerknad(behandlingUuid);
  }

  async markerBehandling({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: EndreMerknadRequestMerknadKode;
  }): Promise<PostMerknadResponse> {
    return this.#backendClient.los.postMerknad({
      behandlingUuid,
      fritekst,
      merknadKode,
    });
  }

  async fjernMerknad({
    behandlingUuid,
    merknadKode,
  }: {
    behandlingUuid: string;
    merknadKode: SlettMerknadRequestMerknadKode;
  }): Promise<DeleteMerknadResponse> {
    return this.#backendClient.los.deleteMerknad({
      behandlingUuid,
      merknadKode,
    });
  }
}
