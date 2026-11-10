import type { BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface BarnOgRammevedtak {
  barn: BarnDto[];
  rammevedtak: RammevedtakDto[];
}

export interface BarnOmsBackendApiType extends BackendTilhørighet {
  hentBarnOgRammevedtak(behandlingUuid: string): Promise<BarnOgRammevedtak>;
}
