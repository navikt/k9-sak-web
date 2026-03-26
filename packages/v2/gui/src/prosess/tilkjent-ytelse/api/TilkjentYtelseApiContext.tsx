import { createContext } from 'react';
import type { TilkjentYtelseApi } from './TilkjentYtelseApi.js';

export const TilkjentYtelseApiContext = createContext<TilkjentYtelseApi | null>(null);
