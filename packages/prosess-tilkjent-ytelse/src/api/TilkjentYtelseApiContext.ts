import { createContext } from 'react';
import type { FeriepengerPrÅr } from './tilkjentYtelseApi.js';

export interface TilkjentYtelseV1Api {
  hentFeriepengegrunnlagPrÅr(behandlingUuid: string): Promise<FeriepengerPrÅr>;
}

export const TilkjentYtelseV1ApiContext = createContext<TilkjentYtelseV1Api | null>(null);
