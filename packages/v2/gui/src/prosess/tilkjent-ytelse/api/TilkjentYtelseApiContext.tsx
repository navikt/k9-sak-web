import { createContext } from 'react';
import type { TilkjentYtelseApi } from './TilkjentYtelseApi.ts';

export const TilkjentYtelseApiContext = createContext<TilkjentYtelseApi | null>(null);
