import { createContext, useContext } from 'react';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export const OmPleietrengendeApiContext = createContext<OmPleietrengendeBackendApiType | null>(null);

export const useOmPleietrengendeApi = (): OmPleietrengendeBackendApiType => {
  const context = useContext(OmPleietrengendeApiContext);
  if (!context) {
    throw new Error('useOmPleietrengendeApi må brukes innenfor en OmPleietrengendeApiContext');
  }
  return context;
};
