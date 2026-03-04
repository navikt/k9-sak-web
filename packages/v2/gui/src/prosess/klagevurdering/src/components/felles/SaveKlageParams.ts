import type { MellomlagringDto as MellomlagringDataDto } from '@k9-sak-web/backend/ungsak/kontrakt/mellomlagring/MellomlagringDto.js';

export type SaveKlageParams = Exclude<MellomlagringDataDto, 'behandlingId'>;
