import { HistorikkAktør as K9SakHistorikkAktør } from '../../../k9sak/kodeverk/historikk/HistorikkAktør.js';
import { HistorikkAktør as K9KlageHistorikkAktør } from '../../../k9klage/kodeverk/historikk/HistorikkAktør.js';
import { HistorikkAktør as K9TilbakeHistorikkAktør } from '../../../k9tilbake/kodeverk/historikk/HistorikkAktør.js';
import { HistorikkAktør as UngSakHistorikkAktør } from '../../../ungsak/kodeverk/historikk/HistorikkAktør.js';
import { HistorikkAktør as UngTilbakeHistorikkAktør } from '../../../ungtilbake/kodeverk/historikk/HistorikkAktør.js';
import { safeConstCombine } from '../../../typecheck/safeConstCombine.js';

export type HistorikkAktør =
  | K9SakHistorikkAktør
  | K9KlageHistorikkAktør
  | K9TilbakeHistorikkAktør
  | UngSakHistorikkAktør
  | UngTilbakeHistorikkAktør;

export const HistorikkAktør = safeConstCombine(
  K9SakHistorikkAktør,
  K9KlageHistorikkAktør,
  K9TilbakeHistorikkAktør,
  UngSakHistorikkAktør,
  UngTilbakeHistorikkAktør,
);
