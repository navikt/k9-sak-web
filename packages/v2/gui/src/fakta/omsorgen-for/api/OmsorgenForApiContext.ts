import { createContext, useContext } from 'react';
import type { OmsorgenForApi } from './OmsorgenForApi.js';

export const OmsorgenForApiContext = createContext<OmsorgenForApi | null>(null);

export const useOmsorgenForApi = (): OmsorgenForApi => {
  const context = useContext(OmsorgenForApiContext);
  if (!context) {
    throw new Error('useOmsorgenForApi må brukes innenfor en OmsorgenForApiProvider');
  }
  return context;
};
