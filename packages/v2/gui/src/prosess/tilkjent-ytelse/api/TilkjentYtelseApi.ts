import type { FeriepengerPrÅr } from '../components/feriepenger/FeriepengerPanel.js';

export interface TilkjentYtelseApi {
  hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr>;
}
