import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';
import type { BestillBrevDto as K9TilbakeBestillBrevDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/dokument/BestillBrevDto.js';
import type { BestillBrevDto as UngTilbakeBestillBrevDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/dokument/BestillBrevDto.js';

type K9TilbakeBestillBrevDtoBehandlingIdFixed = Omit<K9TilbakeBestillBrevDto, 'behandlingId' | 'behandlingUuid'> &
  Pick<UngTilbakeBestillBrevDto, 'behandlingUuid'>;

export type TilbakeBestillBrevDto = K9TilbakeBestillBrevDtoBehandlingIdFixed | UngTilbakeBestillBrevDto;

/**
 * Definerer api for serverkommunikasjon for TilbakeMessages.tsx, sidan dette er å forskjellig frå api for meldinger for saker.
 */
export interface TilbakeMeldingerApi {
  readonly backend: 'k9tilbake' | 'ungtilbake';

  bestillDokument(bestilling: TilbakeBestillBrevDto): Promise<void>;
  lagForhåndsvisningPdf(data: TilbakeBestillBrevDto): Promise<Blob>;
  hentMaler(behandlingUuid: string): Promise<BrevmalDto[]>;
}
