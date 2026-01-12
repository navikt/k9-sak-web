import { useContext } from 'react';
import ContainerContext from './ContainerContext';
import type ContainerContract from '../types/ContainerContract';

/**
 * Hook for safely accessing the ContainerContext.
 * Throws an error if used outside of ContainerContext.Provider.
 */
const useContainerContext = (): ContainerContract => {
  const context = useContext(ContainerContext);
  if (context === null) {
    throw new Error('useContainerContext must be used within a ContainerContext.Provider');
  }
  return context;
};

export default useContainerContext;
