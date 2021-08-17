import BehandlingAppKontekst from './behandlingAppKontekstTsType';

type Behandling = BehandlingAppKontekst & {
  taskStatus?: {
    readOnly: boolean;
  };
};

export default Behandling;
