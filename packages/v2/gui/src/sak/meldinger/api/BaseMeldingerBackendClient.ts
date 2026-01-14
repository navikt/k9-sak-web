import type { LagForhåndsvisningRequest, MessagesApi } from './MessagesApi.js';
import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/BestillBrevDto.js';
import { brev_getBrevMottakerinfoEreg } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
import { type AvsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import type { EregOrganizationLookupResponse } from '../EregOrganizationLookupResponse.js';
import {
  requestIntentionallyAborted,
  type RequestIntentionallyAborted,
} from '@k9-sak-web/backend/shared/RequestIntentionallyAborted.js';
import { isAbortedFetchError } from '@k9-sak-web/backend/shared/isAbortedFetchError.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';

/**
 * Inneholder funksjonalitet for MessagesApi som er delt mellom de backend spesifikke implementasjonene for k9-sak og k9-klage.
 * Slik at vi får samlet denne koden på ett sted.
 */
export abstract class BaseMeldingerBackendClient implements MessagesApi {
  public abstract readonly backend: MessagesApi['backend'];
  readonly #avsenderApplikasjon: AvsenderApplikasjon;

  #formidling: FormidlingClient;

  constructor(avsenderApplikasjon: AvsenderApplikasjon, formidlingClient: FormidlingClient) {
    this.#avsenderApplikasjon = avsenderApplikasjon;
    this.#formidling = formidlingClient;
  }

  /**
   * Henter info om mottaker fra ereg. Kallet går til k9-sak uavhengig av behandlingstype, så derfor er denne implementert
   * her uten bruk av avsenderapplikasjon.
   */
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

  abstract bestillDokument(bestilling: BestillBrevDto): Promise<void>;

  async lagForhåndsvisningPdf(data: LagForhåndsvisningRequest): Promise<Blob> {
    return this.#formidling.forhåndsvisning.lagPdf({ ...data, avsenderApplikasjon: this.#avsenderApplikasjon });
  }

  async hentInnholdBrevmal(
    fagsakYtelsestype: FagsakYtelsesType,
    eksternReferanse: string,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]> {
    return this.#formidling.maler.hentInnholdBrevmalType(
      fagsakYtelsestype,
      eksternReferanse,
      this.#avsenderApplikasjon,
      maltype,
    );
  }

  async hentMaler(fagsakYtelsestype: FagsakYtelsesType, behandlingUuid: string): Promise<Template[]> {
    const templateMap = await this.#formidling.maler.hentBrevmaler(
      fagsakYtelsestype,
      behandlingUuid,
      this.#avsenderApplikasjon,
    );
    return [...templateMap.values()];
  }
}
