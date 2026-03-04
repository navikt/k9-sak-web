import { hentFeriepengegrunnlag } from '@k9-sak-web/backend/k9sak/sdk.js';
import type { FeriepengerPrÅr } from '../components/feriepenger/FeriepengerPanel.js';
import type { TilkjentYtelseApi } from './TilkjentYtelseApi.js';

export default class K9TilkjentYtelseBackendClient implements TilkjentYtelseApi {
  /**
   * Returnerer feriepengegrunnlag gruppert pr år
   */
  async hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr> {
    const feriepengegrunnlag = (await hentFeriepengegrunnlag({ query: { behandlingUuid } })).data;
    if (feriepengegrunnlag != null) {
      return Map.groupBy(feriepengegrunnlag.andeler, andel => andel.opptjeningsår);
    } else {
      return new Map();
    }
  }
}
