import { createContext } from 'react';
import type { DokumenterApi } from './DokumenterApi.js';

export const DokumenterApiContext = createContext<DokumenterApi | null>(null);
