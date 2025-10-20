import BehandlingAppKontekst from './behandlingAppKontekstTsType';

type OpptjeningBehandling = BehandlingAppKontekst & {
  taskStatus?: {
    readOnly: boolean;
  };
};

export default OpptjeningBehandling;
