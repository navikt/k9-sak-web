export type Mottaker = {
  id: string;
  type: string;
};

interface Brevmaler {
  [index: string]: {
    navn: string;
    mottakere: Mottaker[];
  };
}

export default Brevmaler;
