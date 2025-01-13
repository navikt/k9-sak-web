import React from 'react';
import ContainerContract from '../types/ContainerContract';
import ContainerContext from './context/ContainerContext';
import OmPleietrengende from './om-pleietrengende/OmPleietrengende';
import RettVedDødController from './rett-ved-død/rett-ved-død-controller/RettVedDødController';
import '../styles.css';

interface MainComponentProps {
  data: ContainerContract;
}

const MainComponent = ({ data }: MainComponentProps): JSX.Element => (
  <ContainerContext.Provider value={data}>
    <h1 className="text-3xl font-semibold m-0">Om barnet</h1>
    <OmPleietrengende />
    <div className="mt-10 pt-4 border-0 border-t border-solid border-gray-300">
      <RettVedDødController />
    </div>
  </ContainerContext.Provider>
);
export default MainComponent;
