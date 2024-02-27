import { type YtelsesType } from '@k9-sak-web/backend/k9sak/extra/ytelseTyper.js';
import { ApiError, K9SakClient, OrganisasjonsEnhet } from '@k9-sak-web/backend/k9sak/generated';
import { EregOrganizationLookupResponse } from './EregOrganizationLookupResponse';

export default class MeldingerBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getBrevMottakerinfoEreg(organisasjonsnr: string): Promise<EregOrganizationLookupResponse> {
    try {
      const resp = await this.#k9sak.brev.getBrevMottakerinfoEreg({ organisasjonsnr });
      if (resp !== null && resp.navn !== undefined) {
        return {
          name: resp.navn,
        };
      }
      return {
        notFound: true,
      };
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) {
        return { invalidOrgnum: true };
      }
      throw e;
    }
  }

  async hentBehandlendeEnheter(ytelsesType: YtelsesType): Promise<OrganisasjonsEnhet[]> {
    return this.#k9sak.kodeverk.hentBehandlendeEnheter(ytelsesType);
  }
}
