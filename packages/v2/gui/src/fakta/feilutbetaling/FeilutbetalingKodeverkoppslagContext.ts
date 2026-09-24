import { createContext, useContext } from 'react';

export interface FeilutbetalingKodeverkoppslag {
  hentHendelseTypeNavn(kode?: string): string;
  hentHendelseUnderTypeNavn(kode?: string): string;
  hentVidereBehandlingNavn(kode?: string): string;
}

export const FeilutbetalingKodeverkoppslagContext = createContext<FeilutbetalingKodeverkoppslag | null>(null);

export const useFeilutbetalingKodeverkoppslag = (): FeilutbetalingKodeverkoppslag => {
  const context = useContext(FeilutbetalingKodeverkoppslagContext);
  if (!context) {
    throw new Error(
      'useFeilutbetalingKodeverkoppslag må brukes innenfor en FeilutbetalingKodeverkoppslagContext.Provider',
    );
  }
  return context;
};
