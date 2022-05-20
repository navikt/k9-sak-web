export type Mottaker = {
  id: string;
  type: string;
};

export interface Brevmal {
  navn: string;
  kode?: string;
  tilgjengelig?: boolean;
  malinnhold_link?: string;
  mottakere?: Mottaker[];
}

export interface Brevmaler {
  [index: string]: Brevmal;
}

export default Brevmaler;
