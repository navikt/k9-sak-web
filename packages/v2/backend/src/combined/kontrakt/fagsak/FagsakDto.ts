import type { FagsakDto as K9FagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';
import type { FagsakDto as UngFagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';

export type FagsakDto = K9FagsakDto | UngFagsakDto;
