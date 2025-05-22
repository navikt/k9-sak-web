import {
  type GetVilkårV3Response as K9GetVilkårV3Response,
  type K9SakClient,
} from '@k9-sak-web/backend/k9sak/generated';
import {
  type GetVilkårV3Response as UngGetVilkårV3Response,
  type UngSakClient,
} from '@k9-sak-web/backend/ungsak/generated';

export default class VilkårBackendClient {
  #backendClient: K9SakClient | UngSakClient;

  constructor(backendClient: K9SakClient | UngSakClient) {
    this.#backendClient = backendClient;
  }

  async getVilkår(behandlingUuid: string): Promise<K9GetVilkårV3Response | UngGetVilkårV3Response> {
    return this.#backendClient.vilkår.getVilkårV3(behandlingUuid);
  }
}
