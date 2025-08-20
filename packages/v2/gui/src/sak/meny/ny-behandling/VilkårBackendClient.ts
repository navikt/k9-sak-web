import { type GetVilkårV3Response as K9GetVilkårV3Response } from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  type GetVilkårV3Response as UngGetVilkårV3Response,
  type UngSakClient,
} from '@k9-sak-web/backend/ungsak/generated';
import { getUngSakClient } from '@k9-sak-web/backend/ungsak/client';
import { vilkår_getVilkårV3 as k9sak_vilkår_getVilkårV3 } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { k9SakOrUngSak, type K9SakOrUngSak } from '../../../utils/multibackend.js';

export default class VilkårBackendClient {
  #backendChoice: K9SakOrUngSak;
  #sakClient: UngSakClient | null = null;

  constructor(backendChoice: K9SakOrUngSak) {
    this.#backendChoice = backendChoice;
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      this.#sakClient = getUngSakClient();
    }
  }

  async getVilkår(behandlingUuid: string): Promise<K9GetVilkårV3Response | UngGetVilkårV3Response> {
    if (this.#sakClient != null) {
      return this.#sakClient.vilkår.getVilkårV3(behandlingUuid);
    }
    return (await k9sak_vilkår_getVilkårV3({ query: { behandlingUuid } })).data;
  }
}
