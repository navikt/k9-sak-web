import ContainerContract from '../types/ContainerContract';
import MedisinskVilkår from './components/medisinsk-vilkår/MedisinskVilkår';
import ContainerContext from './context/ContainerContext';

interface MainComponentProps {
  data: ContainerContract;
}

const MedisinskVilkårContainer = ({ data }: MainComponentProps): JSX.Element => (
  <div id="medisinskVilkår">
    <ContainerContext.Provider value={data}>
      <MedisinskVilkår />
    </ContainerContext.Provider>
  </div>
);

export default MedisinskVilkårContainer;
