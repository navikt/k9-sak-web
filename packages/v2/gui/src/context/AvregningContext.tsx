import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface AvregningFormState {
  formState: any;
  setFormState: (state: any) => void;
  reset: () => void;
}

const AvregningFormContext = createContext<AvregningFormState | undefined>(undefined);

interface AvregningFormProviderProps {
  children: ReactNode;
}

export const AvregningFormProvider = ({ children }: AvregningFormProviderProps) => {
  const [formState, setFormStateInternal] = useState<any>(0);

  const setFormState = useCallback((state: any) => {
    setFormStateInternal(state);
  }, []);

  const reset = useCallback(() => {
    setFormStateInternal(0);
  }, []);

  const value = useMemo<AvregningFormState>(
    () => ({
      formState,
      setFormState,
      reset,
    }),
    [formState, setFormState, reset],
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
