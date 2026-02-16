import type { BestillBrevDto as K9KlageBestillBrevDto } from '../../../k9klage/kontrakt/dokument/BestillBrevDto.js';
import type { BestillBrevDto as K9SakBestillBrevDto } from '../../../k9sak/kontrakt/dokument/BestillBrevDto.js';

export type BestillBrevDto = K9SakBestillBrevDto | K9KlageBestillBrevDto;
