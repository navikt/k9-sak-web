import { createContext } from 'react';

export const ProsessPanelContext = createContext<{
  erValgt: (id: string) => boolean;
  erTilBehandlingEllerBehandlet: (id: string) => boolean;
} | null>(null);
