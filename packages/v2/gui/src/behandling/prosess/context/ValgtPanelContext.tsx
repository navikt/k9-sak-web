import { createContext, useContext } from 'react';

/**
 * Context for å dele informasjon om valgt panel med alle prosesspaneler.
 * Dette lar paneler reagere på endringer i valgt panel uten å måtte bruke React.cloneElement.
 */
interface ValgtPanelContextValue {
  /** ID-en til det valgte panelet */
  valgtPanelId: string | null;
}

const ValgtPanelContext = createContext<ValgtPanelContextValue | null>(null);

export const ValgtPanelProvider = ValgtPanelContext.Provider;

/**
 * Hook for å sjekke om dette panelet er valgt.
 * 
 * @param panelId - ID-en til panelet som skal sjekkes
 * @returns true hvis panelet er valgt, false ellers
 */
export function useErValgtPanel(panelId: string): boolean {
  const context = useContext(ValgtPanelContext);
  
  if (!context) {
    // Hvis context ikke finnes (f.eks. i Storybook), returner false
    return false;
  }
  
  return context.valgtPanelId === panelId;
}
