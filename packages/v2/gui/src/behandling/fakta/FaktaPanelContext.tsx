import { createContext } from 'react';

export const FaktaPanelContext = createContext<{
  erValgt: (id: string) => boolean;
} | null>(null);
