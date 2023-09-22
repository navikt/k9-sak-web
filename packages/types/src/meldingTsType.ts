import { Link } from '@k9-sak-web/rest-api';

export type Mottaker = {
  id: string;
  type: string;
  harVarsel?: boolean;
};

export interface Brevmal {
  navn: string;
  kode?: string;
  støtterFritekst: boolean;
  støtterTittelOgFritekst: boolean;
  tilgjengelig?: boolean;
  linker?: Link[];
  mottakere?: Mottaker[];
}

export interface Brevmaler {
  [index: string]: Brevmal;
}

export default Brevmaler;
