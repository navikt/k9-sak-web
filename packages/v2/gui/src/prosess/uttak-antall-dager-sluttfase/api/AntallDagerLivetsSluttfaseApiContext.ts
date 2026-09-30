import { createContext, useContext } from 'react';
import type { AntallDagerLivetsSluttfaseBackendApiType } from './AntallDagerLivetsSluttfaseBackendApiType.js';

export const AntallDagerLivetsSluttfaseApiContext = createContext<AntallDagerLivetsSluttfaseBackendApiType | null>(
  null,
);

export const useAntallDagerLivetsSluttfaseApi = (): AntallDagerLivetsSluttfaseBackendApiType => {
  const context = useContext(AntallDagerLivetsSluttfaseApiContext);
  if (!context) {
    throw new Error('useAntallDagerLivetsSluttfaseApi må brukes innenfor en AntallDagerLivetsSluttfaseApiContext');
  }
  return context;
};
