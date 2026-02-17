import { createContext, useCallback, useContext, useState, type FC, type ReactNode } from 'react';
import PendingModal from './PendingModal.js';

interface PendingModalContextValue {
  /** Sett melding som vises i modalen. Kall med `undefined` for å skjule. */
  visPendingModal: (melding?: string) => void;
  /** Skjul modalen */
  skjulPendingModal: () => void;
}

const PendingModalContext = createContext<PendingModalContextValue>({
  visPendingModal: () => undefined,
  skjulPendingModal: () => undefined,
});

/**
 * Provider som rendrer en app-bred PendingModal.
 *
 * Legg denne høyt i komponent-treet (f.eks. i RootLayout).
 * Hooks som `useBekreftAksjonspunkt` bruker `usePendingModal()` for å
 * styre visningen automatisk under polling.
 */
export const PendingModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState(false);
  const [melding, setMelding] = useState<string | undefined>(undefined);

  const visPendingModal = useCallback((m?: string) => {
    setPending(true);
    setMelding(m);
  }, []);

  const skjulPendingModal = useCallback(() => {
    setPending(false);
    setMelding(undefined);
  }, []);

  return (
    <PendingModalContext value={{ visPendingModal, skjulPendingModal }}>
      {children}
      {pending && <PendingModal melding={melding} />}
    </PendingModalContext>
  );
};

/**
 * Hook for å vise/skjule den app-brede PendingModal.
 *
 * @example
 * ```ts
 * const { visPendingModal, skjulPendingModal } = usePendingModal();
 * visPendingModal('Venter på svar fra backend...');
 * // ... etter at prosesseringen er ferdig:
 * skjulPendingModal();
 * ```
 */
export const usePendingModal = (): PendingModalContextValue => useContext(PendingModalContext);
