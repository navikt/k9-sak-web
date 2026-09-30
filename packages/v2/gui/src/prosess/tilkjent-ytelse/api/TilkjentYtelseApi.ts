import type { FeriepengerPrÅr } from '../components/feriepenger/FeriepengerPanel.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface TilkjentYtelseApi extends BackendTilhørighet {
  hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr>;
}
