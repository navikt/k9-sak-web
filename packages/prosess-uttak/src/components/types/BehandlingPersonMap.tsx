import Kjønnkode from '@k9-sak-web/types/src/Kjønnkode';

interface BehandlingPersonMap {
  [behandlingId: string]: {
    kjønnkode: Kjønnkode;
    fnr: string;
  };
}

export default BehandlingPersonMap;
