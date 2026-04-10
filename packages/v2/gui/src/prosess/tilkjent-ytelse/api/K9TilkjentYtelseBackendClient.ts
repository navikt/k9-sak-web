import { beregningsresultat_hentFeriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { FeriepengerPrÅr } from '../components/feriepenger/FeriepengerPanel.js';
import type { TilkjentYtelseApi } from './TilkjentYtelseApi.js';

export default class K9TilkjentYtelseBackendClient implements TilkjentYtelseApi {
  /**
   * Returnerer feriepengegrunnlag gruppert pr år
   */
  async hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr> {
    const feriepengegrunnlag = (await beregningsresultat_hentFeriepengegrunnlag({ query: { behandlingUuid } })).data;
    if (feriepengegrunnlag != null) {
      const grense = new Date().getFullYear() - 2;
      const filtrert = feriepengegrunnlag.andeler.filter(andel => andel.opptjeningsår >= grense);
      return Map.groupBy(filtrert, andel => andel.opptjeningsår);
    } else {
      return new Map();
    }
  }
}
