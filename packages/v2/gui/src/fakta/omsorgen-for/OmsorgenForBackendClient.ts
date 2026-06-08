import { omsorgenFor_hentOmsorgenForInformasjon } from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export default class OmsorgenForBackendClient {
  async getOmsorgsperioder(behandlingUuid: string) {
    return (await omsorgenFor_hentOmsorgenForInformasjon({ query: { behandlingUuid } })).data;
  }
}
