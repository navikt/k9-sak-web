import { createContext } from 'react';

export const ProsessPanelContext = createContext<{
  erValgt: (id: string) => boolean;
  erVurdert: (id: string) => boolean;
} | null>(null);
