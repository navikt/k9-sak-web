import { ApiError, K9SakClient, type OrganisasjonsEnhet } from '@k9-sak-web/backend/k9sak/generated';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { EregOrganizationLookupResponse } from './EregOrganizationLookupResponse.js';

export default class MeldingerBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getBrevMottakerinfoEreg(organisasjonsnr: string, abort?: AbortSignal): Promise<EregOrganizationLookupResponse> {
    const abortListenerRemover = new AbortController(); // Trengs nok eigentleg ikkje
    try {
      const promise = this.#k9sak.brev.getBrevMottakerinfoEreg({ organisasjonsnr });
      abort?.addEventListener('abort', () => promise.cancel(), { signal: abortListenerRemover.signal });
      const resp = await promise;
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
    } finally {
      abortListenerRemover.abort();
    }
  }

  async hentBehandlendeEnheter(ytelsesType: FagsakYtelsesType): Promise<OrganisasjonsEnhet[]> {
    return this.#k9sak.kodeverk.hentBehandlendeEnheter(ytelsesType);
  }
}
