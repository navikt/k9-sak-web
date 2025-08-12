import type {
  DeleteMerknadResponse,
  k9_kodeverk_produksjonsstyring_BehandlingMerknadType as BehandlingMerknadType,
  GetMerknadResponse,
  K9SakClient,
  PostMerknadResponse,
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
    merknadKode: BehandlingMerknadType;
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
    merknadKode: BehandlingMerknadType;
  }): Promise<DeleteMerknadResponse> {
    return this.#backendClient.los.deleteMerknad({
      behandlingUuid,
      merknadKode,
    });
  }
}
