import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { beregningsresultat_hentFeriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { FeriepengerPrÅr } from './components/feriepenger/FeriepengerPanel.js';

export default class TilkjentYtelseBackendClient {
  static finnListeMedOpptjeningsår = (andeler: FeriepengegrunnlagAndel[]): number[] => {
    const årsliste = andeler.map(andel => andel.opptjeningsår).toSorted((a, b) => a - b);
    return [...new Set(årsliste)];
  };

  /**
   * Returnerer feriepengegrunnlag gruppert pr år
   */
  async hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr> {
    const feriepengegrunnlag =
      (await beregningsresultat_hentFeriepengegrunnlag({ query: { behandlingUuid } })).data ?? null;
    const opptjeningsår = TilkjentYtelseBackendClient.finnListeMedOpptjeningsår(feriepengegrunnlag.andeler);
    const andelerPrÅr = new Map<number, FeriepengegrunnlagAndel[]>();
    for (const år of opptjeningsår) {
      const andelerIÅret = feriepengegrunnlag.andeler.filter(andel => andel.opptjeningsår == år);
      andelerPrÅr.set(år, andelerIÅret);
    }
    return andelerPrÅr;
  }
}
