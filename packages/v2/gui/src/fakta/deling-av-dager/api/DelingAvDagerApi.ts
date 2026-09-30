import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface DelingAvDagerApi extends BackendTilhørighet {
  hentRammevedtak(behandlingUuid: string): Promise<RammevedtakDto[]>;
}
