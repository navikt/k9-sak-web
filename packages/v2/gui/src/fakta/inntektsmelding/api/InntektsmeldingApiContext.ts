import { createContext } from 'react';
import type { InntektsmeldingApi } from './InntektsmeldingApi.js';

export const InntektsmeldingApiContext = createContext<InntektsmeldingApi | null>(null);
