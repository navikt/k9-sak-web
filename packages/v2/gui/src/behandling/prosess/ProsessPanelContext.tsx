import { createContext } from 'react';
import type { PanelRegistrering, ProcessMenuStepType } from './types/panelTypes';

export const ProsessPanelContext = createContext<{
  onRegister: (id: string, tekstKode: string, info: PanelRegistrering) => void;
  onUnregister: (id: string) => void;
  onUpdateType: (id: string, type: ProcessMenuStepType) => void;
  erValgt: (id: string) => boolean;
} | null>(null);
