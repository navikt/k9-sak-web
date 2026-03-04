import type { K9GetVilkårV3Response } from '@k9-sak-web/backend/k9sak/tjenester/vilkår/K9GetVilkårV3Response.js';
import type { UngGetVilkårV3Response } from '@k9-sak-web/backend/ungsak/tjenester/vilkår/UngGetVilkårV3Response.js';
import { getVilkår as k9sak_vilkår_getVilkårV3 } from '@k9-sak-web/backend/k9sak/sdk.js';
import { getVilkår as ungsak_vilkår_getVilkårV3 } from '@k9-sak-web/backend/ungsak/sdk.js';
import { k9SakOrUngSak, type K9SakOrUngSak } from '../../../utils/multibackend.js';

export default class VilkårBackendClient {
  #backendChoice: K9SakOrUngSak;

  constructor(backendChoice: K9SakOrUngSak) {
    this.#backendChoice = backendChoice;
  }

  async getVilkår(behandlingUuid: string): Promise<K9GetVilkårV3Response | UngGetVilkårV3Response> {
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      return (await ungsak_vilkår_getVilkårV3({ query: { behandlingUuid } })).data;
    }
    return (await k9sak_vilkår_getVilkårV3({ query: { behandlingUuid } })).data;
  }
}
