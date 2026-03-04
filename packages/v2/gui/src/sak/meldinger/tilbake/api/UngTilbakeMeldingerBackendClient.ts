import {
  bestillBrev,
  forhåndsvisBrev,
  hentBrevmaler,
} from '@k9-sak-web/backend/ungtilbake/sdk.js';
import type { TilbakeBestillBrevDto, TilbakeMeldingerApi } from './TilbakeMeldingerApi.js';
import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';

export class UngTilbakeMeldingerBackendClient implements TilbakeMeldingerApi {
  readonly backend = 'ungtilbake';

  async bestillDokument(bestilling: TilbakeBestillBrevDto): Promise<void> {
    await bestillBrev({ body: bestilling });
  }

  async lagForhåndsvisningPdf(data: TilbakeBestillBrevDto): Promise<Blob> {
    return (await forhåndsvisBrev({ body: data })).data;
  }

  async hentMaler(behandlingUuid: string): Promise<BrevmalDto[]> {
    return (await hentBrevmaler({ query: { behandlingUuid } })).data;
  }
}
