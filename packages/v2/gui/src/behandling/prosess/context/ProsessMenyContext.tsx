import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { PanelRegistrering } from '../types/panelTypes.js';

/**
 * Kontekstverdi for prosessmeny.
 * Gir metoder for å registrere/avregistrere paneler og håndtere panelvalg.
 */
interface ProsessMenyContextValue {
  /** Registrer et panel med menyen */
  registrerPanel: (registrering: PanelRegistrering) => void;

  /** Avregistrer et panel fra menyen */
  avregistrerPanel: (id: string) => void;

  /** ID til det valgte panelet */
  valgtPanelId: string | null;

  /** Sett hvilket panel som er valgt */
  setValgtPanelId: (id: string | null) => void;

  /** Alle registrerte paneler */
  paneler: Map<string, PanelRegistrering>;
}

/**
 * React context for prosessmeny.
 * Brukes til å samle panelregistreringer fra child-komponenter.
 */
export const ProsessMenyContext = createContext<ProsessMenyContextValue | undefined>(undefined);

/**
 * Props for ProsessMenyProvider.
 */
interface ProsessMenyProviderProps {
  children: ReactNode;
}

/**
 * Provider-komponent for prosessmeny context.
 * Wrapper children og gir tilgang til panelregistreringsfunksjonalitet.
 * 
 * @example
 * ```tsx
 * <ProsessMenyProvider>
 *   <VarselProsessStegInitPanel />
 *   <BeregningProsessStegInitPanel />
 * </ProsessMenyProvider>
 * ```
 */
export function ProsessMenyProvider({ children }: ProsessMenyProviderProps) {
  const [paneler, setPaneler] = useState<Map<string, PanelRegistrering>>(new Map());
  const [valgtPanelId, setValgtPanelId] = useState<string | null>(null);

  const contextValue = useMemo<ProsessMenyContextValue>(
    () => ({
      registrerPanel: (registrering: PanelRegistrering) => {
        setPaneler(forrige => {
          const neste = new Map(forrige);
          neste.set(registrering.id, registrering);
          return neste;
        });
      },
      avregistrerPanel: (id: string) => {
        setPaneler(forrige => {
          const neste = new Map(forrige);
          neste.delete(id);
          return neste;
        });
      },
      valgtPanelId,
      setValgtPanelId,
      paneler,
    }),
    [paneler, valgtPanelId],
  );

  return <ProsessMenyContext.Provider value={contextValue}>{children}</ProsessMenyContext.Provider>;
}

/**
 * Hook for å få tilgang til prosessmeny context.
 * Må brukes innenfor en ProsessMenyProvider.
 * 
 * @throws Error hvis brukt utenfor ProsessMenyProvider
 * 
 * @example
 * ```tsx
 * function MyPanel() {
 *   const { registrerPanel, valgtPanelId } = useProsessMenyContext();
 *   // ...
 * }
 * ```
 */
export function useProsessMenyContext(): ProsessMenyContextValue {
  const context = useContext(ProsessMenyContext);
  if (context === undefined) {
    throw new Error('useProsessMenyContext må brukes innenfor en ProsessMenyProvider');
  }
  return context;
}
