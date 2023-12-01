import React from 'react';
import { QueryClientProvider } from 'react-query';
import ContainerContext from './context/ContainerContext';
import queryClient from './context/queryClient';
import ContainerContract from '../types/ContainerContract';
import MedisinskVilkår from './components/medisinsk-vilkår/MedisinskVilkår';

interface MainComponentProps {
  data: ContainerContract;
}

const MainComponent = ({ data }: MainComponentProps): JSX.Element => (
  <div id="medisinskVilkår">
    <QueryClientProvider client={queryClient}>
      <ContainerContext.Provider value={data}>
        <MedisinskVilkår />
      </ContainerContext.Provider>
    </QueryClientProvider>
  </div>
);

export default MainComponent;
