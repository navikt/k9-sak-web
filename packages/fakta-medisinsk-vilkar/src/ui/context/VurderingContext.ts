import React from 'react';
import VurderingContextType from '../../types/VurderingContext';

const VurderingContext = React.createContext<VurderingContextType | null>(null);
export default VurderingContext;
