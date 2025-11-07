import type {
  HistorikkinnslagDto as K9SakHistorikkinnslagDto,
  HistorikkinnslagDtoLinje as K9SakHistorikkinnslagDtoLinje,
} from '../../../k9sak/kontrakt/historikk/HistorikkinnslagDto.js';
import type {
  HistorikkinnslagDto as K9KlageHistorikkinnslagDto,
  HistorikkinnslagDtoLinje as K9KlageHistorikkinnslagDtoLinje,
} from '../../../k9klage/kontrakt/historikk/HistorikkinnslagDto.js';
import type {
  HistorikkinnslagDto as K9TilbakeHistorikkinnslagDto,
  HistorikkinnslagDtoLinje as K9TilbakeHistorikkinnslagDtoLinje,
} from '../../../k9tilbake/kontrakt/historikk/HistorikkinnslagDto.js';
import type {
  HistorikkinnslagDto as UngSakHistorikkinnslagDto,
  HistorikkinnslagDtoLinje as UngSakHistorikkinnslagDtoLinje,
} from '@k9-sak-web/backend/ungsak/kontrakt/historikk/HistorikkinnslagDto.js';
import type {
  HistorikkinnslagDto as UngTilbakeHistorikkinnslagDto,
  HistorikkinnslagDtoLinje as UngTilbakeHistorikkinnslagDtoLinje,
} from '@k9-sak-web/backend/ungtilbake/kontrakt/historikk/HistorikkinnslagDto.js';

export type HistorikkinnslagDto =
  | K9SakHistorikkinnslagDto
  | K9KlageHistorikkinnslagDto
  | K9TilbakeHistorikkinnslagDto
  | UngSakHistorikkinnslagDto
  | UngTilbakeHistorikkinnslagDto;

export type HistorikkinnslagDtoLinje =
  | K9SakHistorikkinnslagDtoLinje
  | K9KlageHistorikkinnslagDtoLinje
  | K9TilbakeHistorikkinnslagDtoLinje
  | UngSakHistorikkinnslagDtoLinje
  | UngTilbakeHistorikkinnslagDtoLinje;
