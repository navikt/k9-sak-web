import { createContext, useContext } from 'react';
import type { EndringsmeldingPsbTilgangApi } from './EndringsmeldingPsbTilgangApi.js';

export const EndringsmeldingPsbTilgangApiContext = createContext<EndringsmeldingPsbTilgangApi | null>(null);

export const useEndringsmeldingPsbTilgangApi = (): EndringsmeldingPsbTilgangApi => {
  const context = useContext(EndringsmeldingPsbTilgangApiContext);
  if (!context) {
    throw new Error('useEndringsmeldingPsbTilgangApi må brukes innenfor en EndringsmeldingPsbTilgangApiContext');
  }
  return context;
};
