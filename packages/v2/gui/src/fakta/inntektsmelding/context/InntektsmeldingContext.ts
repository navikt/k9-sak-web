import { createContext, useContext } from 'react';
import type { InntektsmeldingContextType } from '../types';

const InntektsmeldingContext = createContext<InntektsmeldingContextType | null>(null);

export const useInntektsmeldingContext = (): InntektsmeldingContextType => {
  const context = useContext(InntektsmeldingContext);
  if (context === null) {
    throw new Error('useInntektsmeldingContext must be used within InntektsmeldingContext.Provider');
  }
  return context;
};

export default InntektsmeldingContext;
