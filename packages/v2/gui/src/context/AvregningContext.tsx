import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import type { KontrollerEtterbetalingFormData } from '../prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetaling.js';
import type { VurderFeilutbetalingFormValues } from '../prosess/avregning/vurder-feilutbetaling/VurderFeilutbetaling.js';

interface AvregningFormStore {
  høyEtterbetaling?: KontrollerEtterbetalingFormData;
  feilutbetaling?: VurderFeilutbetalingFormValues;
}

interface AvregningFormState {
  setHøyEtterbetaling: (values: KontrollerEtterbetalingFormData) => void;
  setFeilutbetaling: (values: VurderFeilutbetalingFormValues) => void;
  clearHøyEtterbetaling: () => void;
  clearFeilutbetaling: () => void;
  getHøyEtterbetalingState: () => KontrollerEtterbetalingFormData | undefined;
  getFeilutbetalingState: () => VurderFeilutbetalingFormValues | undefined;
}

const AvregningFormContext = createContext<AvregningFormState | undefined>(undefined);

interface AvregningFormProviderProps {
  behandlingId: number | undefined;
  children: ReactNode;
}

// denne kan holde på state for aksjonspunktene i avregning
// behovet oppstår fordi RHF unmountes og state forsvinner hvis man klikker seg
// inn i et annet prosesspanel.
// når behandlingId endres, nullstilles state
export const AvregningFormProvider = ({ behandlingId, children }: AvregningFormProviderProps) => {
  const [formStore, setFormStore] = useState<AvregningFormStore>({});

  const prevBehandlingIdRef = useRef(behandlingId);

  useEffect(() => {
    if (prevBehandlingIdRef.current !== behandlingId) {
      setFormStore({});
      prevBehandlingIdRef.current = behandlingId;
    }
  }, [behandlingId]);

  const setHøyEtterbetaling = useCallback((values: KontrollerEtterbetalingFormData) => {
    setFormStore(prev => ({ ...prev, høyEtterbetaling: values }));
  }, []);

  const setFeilutbetaling = useCallback((values: VurderFeilutbetalingFormValues) => {
    setFormStore(prev => ({ ...prev, feilutbetaling: values }));
  }, []);

  const clearHøyEtterbetaling = useCallback(() => {
    setFormStore(prev => ({ ...prev, høyEtterbetaling: undefined }));
  }, []);

  const clearFeilutbetaling = useCallback(() => {
    setFormStore(prev => ({ ...prev, feilutbetaling: undefined }));
  }, []);

  const getHøyEtterbetalingState = useCallback(() => formStore.høyEtterbetaling, [formStore]);
  const getFeilutbetalingState = useCallback(() => formStore.feilutbetaling, [formStore]);
  const value = useMemo<AvregningFormState>(
    () => ({
      setHøyEtterbetaling,
      setFeilutbetaling,
      clearHøyEtterbetaling,
      clearFeilutbetaling,
      getHøyEtterbetalingState,
      getFeilutbetalingState,
    }),
    [
      setHøyEtterbetaling,
      setFeilutbetaling,
      clearHøyEtterbetaling,
      clearFeilutbetaling,
      getHøyEtterbetalingState,
      getFeilutbetalingState,
    ],
  );
  return <AvregningFormContext.Provider value={value}>{children}</AvregningFormContext.Provider>;
};

export const useAvregningFormState = (): AvregningFormState => {
  const context = useContext(AvregningFormContext);

  if (context == null) {
    throw new Error('useAvregningFormState must be used within an AvregningFormProvider');
  }

  return context;
};
