import { GetVilkårV3Response, type K9SakClient } from '@k9-sak-web/backend/k9sak/generated';

export default class VilkårBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getVilkår(behandlingUuid: string): Promise<GetVilkårV3Response> {
    return this.#k9sak.vilkår.getVilkårV3(behandlingUuid);
  }
}
