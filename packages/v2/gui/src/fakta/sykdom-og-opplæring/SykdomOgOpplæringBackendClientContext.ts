import { createContext, useContext } from 'react';
import type { SykdomOgOpplæringApi } from './api/SykdomOgOpplæringApi.js';

export const SykdomOgOpplæringBackendClientContext = createContext<SykdomOgOpplæringApi | null>(null);

export const useSykdomOgOpplæringBackendClient = (): SykdomOgOpplæringApi => {
  const client = useContext(SykdomOgOpplæringBackendClientContext);
  if (!client) {
    throw new Error('useSykdomOgOpplæringBackendClient må brukes innenfor SykdomOgOpplæringBackendClientContext');
  }
  return client;
};
