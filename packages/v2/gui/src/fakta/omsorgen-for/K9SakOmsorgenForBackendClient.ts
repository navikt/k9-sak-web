import { omsorgenFor_hentOmsorgenForInformasjon } from '@k9-sak-web/backend/k9sak/tjenester/omsorg/OmsorgenForApi.js';
import type { OmsorgenForApi } from './api/OmsorgenForApi.js';

export default class K9SakOmsorgenForBackendClient implements OmsorgenForApi {
  readonly backend = 'k9sak';

  async getOmsorgsperioder(behandlingUuid: string) {
    return (await omsorgenFor_hentOmsorgenForInformasjon({ query: { behandlingUuid } })).data;
  }
}
