import { ApiError, type BestillBrevDto, K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.ts';
import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.ts';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.ts';
import { type AvsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.ts';
import type { EregOrganizationLookupResponse } from './EregOrganizationLookupResponse.js';

export default class MeldingerBackendClient {
  #k9sak: K9SakClient;

  #formidling: FormidlingClient;

  constructor(k9sakClient: K9SakClient, formidlingClient: FormidlingClient) {
    this.#k9sak = k9sakClient;
    this.#formidling = formidlingClient;
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

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    return this.#k9sak.brev.bestillDokument(bestilling);
  }

  async lagForhåndsvisningPdf(data: ForhåndsvisDto): Promise<Blob> {
    return this.#formidling.forhåndsvisning.lagPdf(data);
  }

  async hentInnholdBrevmal(
    fagsakYtelsestype: FagsakYtelsesType,
    eksternReferanse: string,
    avsenderApplikasjon: AvsenderApplikasjon,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]> {
    return this.#formidling.maler.hentInnholdBrevmalType(
      fagsakYtelsestype,
      eksternReferanse,
      avsenderApplikasjon,
      maltype,
    );
  }
}
