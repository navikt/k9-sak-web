import { createContext } from 'react';
import type { KlageVurderingApi } from './KlageVurderingApi.js';

export const KlageVurderingApiContext = createContext<KlageVurderingApi | null>(null);
