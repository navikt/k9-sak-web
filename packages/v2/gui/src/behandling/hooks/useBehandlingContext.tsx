import { useCallback, useContext } from 'react';
import { BehandlingContext } from '../context/BehandlingContext';

export const useBehandlingContext = () => {
  const behandlingContext = useContext(BehandlingContext);

  if (!behandlingContext) {
    throw new Error('useBehandlingContext må brukes innenfor en BehandlingContext.Provider');
  }

  const { behandlingId, behandlingVersjon, behandlingType, setBehandlingContext } = behandlingContext;

  const setBehandlingIdOgVersjon = useCallback(
    (id: number, versjon: number) => {
      if (setBehandlingContext) {
        setBehandlingContext({
          behandlingId: id,
          behandlingVersjon: versjon,
          behandlingType,
        });
      }
    },
    [behandlingType],
  );

  return {
    behandlingId,
    behandlingVersjon,
    behandlingType,
    setBehandlingContext,
    setBehandlingIdOgVersjon,
  };
};
