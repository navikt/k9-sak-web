import type { FagsakDto as K9KlageFagsakDto } from '@k9-sak-web/backend/k9klage/kontrakt/fagsak/FagsakDto.js';
import type { FagsakDto as K9SakFagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';
import type { FagsakDto as UngSakFagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';

export type FagsakDto = K9KlageFagsakDto | K9SakFagsakDto | UngSakFagsakDto;
