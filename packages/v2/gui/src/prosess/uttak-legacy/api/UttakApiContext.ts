// LEGACY-UTTAK: Slettes når feature toggle NYTT_UTTAK_PANEL fjernes. Ikke endre.
import { createContext } from 'react';
import type { BehandlingUttakBackendApiType } from '../BehandlingUttakBackendApiType';

export const UttakApiContext = createContext<BehandlingUttakBackendApiType | null>(null);
