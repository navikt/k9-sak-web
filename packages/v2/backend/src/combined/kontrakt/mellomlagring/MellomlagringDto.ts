import type { MellomlagringDto as K9KlageMellomlagringDto } from '@k9-sak-web/backend/k9klage/kontrakt/mellomlagring/MellomlagringDto.js';
import type { MellomlagringDto as UngSakMellomlagringDto } from '@k9-sak-web/backend/ungsak/kontrakt/mellomlagring/MellomlagringDto.js';

export type MellomlagringDto = K9KlageMellomlagringDto | UngSakMellomlagringDto;
