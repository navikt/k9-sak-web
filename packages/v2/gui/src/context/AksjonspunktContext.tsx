import type { BekreftAksjonspunktClient } from '../shared/hooks/useBekreftAksjonspunkt.js';
import { createContext } from 'react';

export const AksjonspunktContext = createContext<BekreftAksjonspunktClient<unknown> | undefined>(undefined);
