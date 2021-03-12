export type Mottaker = {
  id: string;
  type: string;
};

export interface Brevmal {
  navn: string;
  kode?: string;
  mottakere: Mottaker[];
}

interface Brevmaler {
  [index: string]: Brevmal;
}

export default Brevmaler;
