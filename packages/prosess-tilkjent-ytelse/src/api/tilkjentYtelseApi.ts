import { beregningsresultat_hentFeriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type FeriepengerPrÅr = Map<number, FeriepengegrunnlagAndel[]>;

export const hentFeriepengegrunnlagPrÅr = async (behandlingUuid: string): Promise<FeriepengerPrÅr> => {
  const feriepengegrunnlag = (await beregningsresultat_hentFeriepengegrunnlag({ query: { behandlingUuid } })).data;
  if (!feriepengegrunnlag) {
    return new Map();
  }
  const grense = new Date().getFullYear() - 2;
  const result = new Map<number, FeriepengegrunnlagAndel[]>();
  for (const andel of feriepengegrunnlag.andeler) {
    const year = andel.opptjeningsår;
    if (year < grense) continue;
    if (!result.has(year)) result.set(year, []);
    result.get(year)!.push(andel);
  }
  return result;
};
