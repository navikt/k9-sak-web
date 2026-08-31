import { createContext, useContext } from 'react';
import type { ArbeidOgInntektApi } from './ArbeidOgInntektApi.js';

export const ArbeidOgInntektApiContext = createContext<ArbeidOgInntektApi | null>(null);

export const useArbeidOgInntektApi = (): ArbeidOgInntektApi => {
  const context = useContext(ArbeidOgInntektApiContext);
  if (!context) {
    throw new Error('useArbeidOgInntektApi må brukes innenfor en ArbeidOgInntektApiContext');
  }
  return context;
};
