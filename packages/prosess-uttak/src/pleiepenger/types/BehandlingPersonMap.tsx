import Kjønnkode from '@k9-frontend/types/src/Kjønnkode';

interface BehandlingPersonMap {
  [behandlingId: string]: {
    kjønnkode: Kjønnkode;
    fnr: string;
  };
}

export default BehandlingPersonMap;
