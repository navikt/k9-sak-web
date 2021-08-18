import BehandlingAppKontekst from './behandlingAppKontekstTsType';

export type OpptjeningBehandling = BehandlingAppKontekst & {
  taskStatus?: {
    readOnly: boolean;
  };
};

export default OpptjeningBehandling;
