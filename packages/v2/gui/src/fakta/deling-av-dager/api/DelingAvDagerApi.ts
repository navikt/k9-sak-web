import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';

export interface DelingAvDagerApi {
  hentRammevedtak(behandlingUuid: string): Promise<RammevedtakDto[]>;
}
