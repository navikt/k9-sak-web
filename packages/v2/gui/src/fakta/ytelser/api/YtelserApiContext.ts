import { createContext, useContext } from 'react';
import type { YtelserApi } from './YtelserApi.js';

export const YtelserApiContext = createContext<YtelserApi | null>(null);

export const useYtelserApi = (): YtelserApi => {
  const context = useContext(YtelserApiContext);
  if (!context) {
    throw new Error('useYtelserApi må brukes innenfor en YtelserApiProvider');
  }
  return context;
};
