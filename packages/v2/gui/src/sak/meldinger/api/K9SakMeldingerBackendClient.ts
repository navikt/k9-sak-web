import { type BestillBrevDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/BestillBrevDto.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.ts';
import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.ts';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.ts';
import {
  avsenderApplikasjon,
  type AvsenderApplikasjon,
} from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import {
  requestIntentionallyAborted,
  type RequestIntentionallyAborted,
} from '@k9-sak-web/backend/shared/RequestIntentionallyAborted.js';
import type { EregOrganizationLookupResponse } from '../EregOrganizationLookupResponse.js';
import { brev_bestillDokument, brev_getBrevMottakerinfoEreg } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { isAbortedFetchError } from '@k9-sak-web/backend/shared/isAbortedFetchError.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import type { BackendApi } from '../Messages.js';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';

export default class K9SakMeldingerBackendClient implements BackendApi {
  readonly backend = 'k9sak';

  #formidling: FormidlingClient;

  constructor(formidlingClient: FormidlingClient) {
    this.#formidling = formidlingClient;
  }

  async getBrevMottakerinfoEreg(
    organisasjonsnr: string,
    abort?: AbortSignal,
  ): Promise<EregOrganizationLookupResponse | RequestIntentionallyAborted> {
    if (organisasjonsnr.trim().length !== 9) {
      // organisasjonsnr må vere 9 siffer for å vere gyldig, så avbryt uten å kontakte server viss det ikkje er det.
      return { invalidOrgnum: true };
    }
    try {
      const resp = (
        await brev_getBrevMottakerinfoEreg({
          body: { organisasjonsnr: organisasjonsnr.trim() },
          signal: abort,
        })
      ).data;
      if (resp !== null && resp.navn !== undefined && resp.navn !== null) {
        return {
          name: resp.navn,
          utilgjengelig: resp.utilgjengeligÅrsak || undefined,
        };
      }
      return {
        notFound: true,
      };
    } catch (e) {
      if (isAbortedFetchError(e)) {
        return requestIntentionallyAborted;
      }
      if (e instanceof ExtendedApiError && e.status === 400) {
        return { invalidOrgnum: true };
      }
      throw e;
    }
  }

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    await brev_bestillDokument({ body: bestilling });
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

  async hentMaler(fagsakYtelsestype: FagsakYtelsesType, behandlingUuid: string): Promise<Template[]> {
    const templateMap = await this.#formidling.maler.hentBrevmaler(
      fagsakYtelsestype,
      behandlingUuid,
      avsenderApplikasjon.K9SAK,
    );
    return [...templateMap.values()];
  }
}
