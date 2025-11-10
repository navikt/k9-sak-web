import type { FeriepengerPrÅr } from '../components/feriepenger/FeriepengerPanel.js';
import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@navikt/k9-sak-typescript-client/types';

export interface TilkjentYtelseApi {
  hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr>;
}

/**
 * Hjelpefunksjon for implementering av TilkjentYtelseApi
 */
export const finnListeMedOpptjeningsår = (andeler: FeriepengegrunnlagAndel[]): number[] => {
  const årsliste = andeler.map(andel => andel.opptjeningsår).toSorted((a, b) => a - b);
  return [...new Set(årsliste)];
};
