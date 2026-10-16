import React from 'react';
import { ContainerContract } from '../../types/ContainerContract';

const ContainerContext = React.createContext<ContainerContract | null>(null);
export const useOmsorgenForContext = () => {
  const context = React.useContext(ContainerContext);
  if (!context) {
    throw new Error('useOmsorgenForContext must be used within a ContainerContext');
  }
  return context;
};

export default ContainerContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
