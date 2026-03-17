import { createContext } from 'react';
import type { InntektOgYtelseApi } from './InntektOgYtelseApi.js';

export const InntektOgYtelseApiContext = createContext<InntektOgYtelseApi | null>(null);
