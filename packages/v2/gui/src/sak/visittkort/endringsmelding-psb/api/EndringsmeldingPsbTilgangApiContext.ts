import { createContext, useContext } from 'react';
import type { EndringsmeldingPsbTilgangBackendApiType } from './EndringsmeldingPsbTilgangBackendApiType.js';

export const EndringsmeldingPsbTilgangApiContext = createContext<EndringsmeldingPsbTilgangBackendApiType | null>(null);

export const useEndringsmeldingPsbTilgangApi = (): EndringsmeldingPsbTilgangBackendApiType => {
  const context = useContext(EndringsmeldingPsbTilgangApiContext);
  if (!context) {
    throw new Error('useEndringsmeldingPsbTilgangApi må brukes innenfor en EndringsmeldingPsbTilgangApiContext');
  }
  return context;
};
