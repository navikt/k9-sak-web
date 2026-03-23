import { createContext } from 'react';
import type { BehandlingUttakBackendApiType } from '../BehandlingUttakBackendApiType';

export const UttakApiContext = createContext<BehandlingUttakBackendApiType | null>(null);
