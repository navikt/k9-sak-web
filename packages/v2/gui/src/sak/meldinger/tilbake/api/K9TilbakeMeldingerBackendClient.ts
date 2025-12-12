import { type BestillBrevDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/dokument/BestillBrevDto.js';
import { brev_bestillBrev, brev_forhåndsvisBrev, brev_hentMaler } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { TilbakeBestillBrevDto, TilbakeMeldingerApi } from './TilbakeMeldingerApi.js';
import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';

export class K9TilbakeMeldingerBackendClient implements TilbakeMeldingerApi {
  readonly backend = 'k9tilbake';

  #adaptBestillBrevDto(bestilling: TilbakeBestillBrevDto): BestillBrevDto {
    return {
      ...bestilling,
      behandlingId: { behandlingId: '', behandlingUuid: bestilling.behandlingUuid },
      behandlingUuid: { behandlingId: '', behandlingUuid: bestilling.behandlingUuid },
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
