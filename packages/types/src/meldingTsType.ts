import { Link } from '@k9-sak-web/rest-api';

export type Mottaker = {
  id: string;
  type: string;
};

export interface Brevmal {
  navn: string;
  kode?: string;
  tilgjengelig?: boolean;
  linker?: Link[];
  mottakere?: Mottaker[];
}

export interface Brevmaler {
  [index: string]: Brevmal;
}

export default Brevmaler;
