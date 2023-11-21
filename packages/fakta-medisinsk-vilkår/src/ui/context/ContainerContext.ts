import React from 'react';
import ContainerContract from '../../types/ContainerContract';

const ContainerContext = React.createContext<ContainerContract | null>(null);
export default ContainerContext;
