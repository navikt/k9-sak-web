import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { beregningsresultat_hentFeriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { FeriepengerPrÅr } from '../components/feriepenger/FeriepengerPanel.js';
import { finnListeMedOpptjeningsår, type TilkjentYtelseApi } from './TilkjentYtelseApi.js';

export default class K9TilkjentYtelseBackendClient implements TilkjentYtelseApi {
  /**
   * Returnerer feriepengegrunnlag gruppert pr år
   */
  async hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr> {
    const feriepengegrunnlag =
      (await beregningsresultat_hentFeriepengegrunnlag({ query: { behandlingUuid } })).data ?? null;
    const opptjeningsår = finnListeMedOpptjeningsår(feriepengegrunnlag.andeler);
    const andelerPrÅr = new Map<number, FeriepengegrunnlagAndel[]>();
    for (const år of opptjeningsår) {
      const andelerIÅret = feriepengegrunnlag.andeler.filter(andel => andel.opptjeningsår == år);
      andelerPrÅr.set(år, andelerIÅret);
    }
    return andelerPrÅr;
  }
}
