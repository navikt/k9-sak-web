import Resultattype from './Resultattype';

export interface Periodeinfo {
  grad: number;
  resultat_type: Resultattype;
  årsak?: string;
}

export interface Perioder {
  [fomTom: string]: Periodeinfo;
}

export interface BehandlingUttak {
  perioder: Perioder;
}

interface Behandlinger {
  [behandlingId: string]: BehandlingUttak;
}

export default Behandlinger;
