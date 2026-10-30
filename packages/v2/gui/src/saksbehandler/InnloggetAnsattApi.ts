import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface InnloggetAnsattApi extends BackendTilhørighet<'k9sak' | 'ungsak'> {
  innloggetBruker(): Promise<InnloggetAnsattDto>;
}
