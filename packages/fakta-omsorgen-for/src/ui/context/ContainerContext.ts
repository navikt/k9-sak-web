import React from 'react';
import { ContainerContract } from '../../types/ContainerContract';

const ContainerContext = React.createContext<ContainerContract | null>(null);
export const useOmsorgenForContext = () => {
  const context = React.useContext(ContainerContext);
  return context as ContainerContract;
};
export default ContainerContext;
