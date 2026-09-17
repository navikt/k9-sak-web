import { createContext } from 'react';
import type { NyInntektApi } from './NyInntektApi.js';

export const NyInntektApiContext = createContext<NyInntektApi | null>(null);
