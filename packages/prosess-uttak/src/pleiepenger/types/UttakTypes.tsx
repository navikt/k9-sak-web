export interface Perioder {
  [fomTom: string]: {
    grad: number;
  };
}

export interface BehandlingUttak {
  perioder: Perioder;
}

interface Behandlinger {
  [behandlingId: string]: BehandlingUttak;
}

export default Behandlinger;
