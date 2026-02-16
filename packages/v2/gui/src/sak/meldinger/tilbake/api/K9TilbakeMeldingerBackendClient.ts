import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';
import { brev_bestillBrev, brev_forhåndsvisBrev, brev_hentMaler } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/dokument/BestillBrevDto.js';
import type { TilbakeBestillBrevDto, TilbakeMeldingerApi } from './TilbakeMeldingerApi.js';

export class K9TilbakeMeldingerBackendClient implements TilbakeMeldingerApi {
  readonly backend = 'k9tilbake';

  #adaptBestillBrevDto(bestilling: TilbakeBestillBrevDto): BestillBrevDto {
    return {
      ...bestilling,
      // BestillBrevDto i fptilbake er rart definert. Dette fungerer.
      behandlingId: { behandlingId: bestilling.behandlingUuid, behandlingUuid: bestilling.behandlingUuid },
      behandlingUuid: { behandlingId: bestilling.behandlingUuid, behandlingUuid: bestilling.behandlingUuid },
    };
  }

  async bestillDokument(bestilling: TilbakeBestillBrevDto): Promise<void> {
    await brev_bestillBrev({ body: this.#adaptBestillBrevDto(bestilling) });
  }

  async lagForhåndsvisningPdf(data: TilbakeBestillBrevDto): Promise<Blob> {
    return (await brev_forhåndsvisBrev({ body: this.#adaptBestillBrevDto(data) })).data;
  }

  async hentMaler(behandlingUuid: string): Promise<BrevmalDto[]> {
    return (await brev_hentMaler({ query: { uuid: { behandlingUuid, behandlingId: '' } } })).data;
  }
}
