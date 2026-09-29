import { createContext, useContext } from 'react';
import type { OmPleietrengendeApi } from './OmPleietrengendeApi.js';

export const OmPleietrengendeApiContext = createContext<OmPleietrengendeApi | null>(null);

export const useOmPleietrengendeApi = (): OmPleietrengendeApi => {
  const context = useContext(OmPleietrengendeApiContext);
  if (!context) {
    throw new Error('useOmPleietrengendeApi må brukes innenfor en OmPleietrengendeApiContext');
  }
  return context;
};
