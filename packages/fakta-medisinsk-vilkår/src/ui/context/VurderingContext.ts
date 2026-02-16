import React from 'react';
import type VurderingContextType from '../../types/VurderingContext';

const VurderingContext = React.createContext<VurderingContextType>({
  vurderingstype: undefined,
});
export default VurderingContext;
