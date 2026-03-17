import { createContext } from 'react';
import type { UtenlandsoppholdApi } from './UtenlandsoppholdApi.js';

export const UtenlandsoppholdApiContext = createContext<UtenlandsoppholdApi | null>(null);
