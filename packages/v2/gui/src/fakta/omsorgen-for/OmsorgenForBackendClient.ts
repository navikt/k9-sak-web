import { omsorgenFor_hentOmsorgenForInformasjon } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { OmsorgenForApi } from './api/OmsorgenForApi.js';

export default class OmsorgenForBackendClient implements OmsorgenForApi {
  async getOmsorgsperioder(behandlingUuid: string) {
    return (await omsorgenFor_hentOmsorgenForInformasjon({ query: { behandlingUuid } })).data;
  }
}
