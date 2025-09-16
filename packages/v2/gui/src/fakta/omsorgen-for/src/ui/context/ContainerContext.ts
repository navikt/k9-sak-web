import React from 'react';
import { type ContainerContract } from '../../types/ContainerContract';

const ContainerContext = React.createContext<ContainerContract | null>(null);
export const useOmsorgenForContext = () => {
  const context = React.useContext(ContainerContext);
  if (!context) {
    throw new Error('useOmsorgenForContext must be used within a ContainerContext');
  }
  return context;
};

export default ContainerContext;
