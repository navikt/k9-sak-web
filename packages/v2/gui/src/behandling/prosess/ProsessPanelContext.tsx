import { createContext } from 'react';

export const ProsessPanelContext = createContext<{
  erValgt: (id: string) => boolean;
  harUtfall: (id: string) => boolean;
} | null>(null);
