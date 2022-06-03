export type Mottaker = {
  id: string;
  type: string;
};

export interface Brevmal {
  navn: string;
  kode?: string;
  tilgjengelig?: boolean;
  mottakere?: Mottaker[];
}

export interface Brevmaler {
  [index: string]: Brevmal;
}

export default Brevmaler;
