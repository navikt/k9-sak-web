import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';
import {
  brev_bestillBrev,
  brev_forhåndsvisBrev,
  brev_hentMaler,
} from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';
import type { TilbakeBestillBrevDto, TilbakeMeldingerApi } from './TilbakeMeldingerApi.js';

export class UngTilbakeMeldingerBackendClient implements TilbakeMeldingerApi {
  readonly backend = 'ungtilbake';

  async bestillDokument(bestilling: TilbakeBestillBrevDto): Promise<void> {
    await brev_bestillBrev({ body: bestilling });
  }

  async lagForhåndsvisningPdf(data: TilbakeBestillBrevDto): Promise<Blob> {
    return (await brev_forhåndsvisBrev({ body: data })).data;
  }

  async hentMaler(behandlingUuid: string): Promise<BrevmalDto[]> {
    return (await brev_hentMaler({ query: { behandlingUuid } })).data;
  }
}
