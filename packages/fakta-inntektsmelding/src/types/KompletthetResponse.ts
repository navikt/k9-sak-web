import { Status, Vurdering } from './KompletthetData';

export interface Kompletthet {
  tilstand: Tilstand[];
}
export interface Tilstand {
  periode: string;
  status: Status[];
  tilVurdering: boolean;
  begrunnelse: string;
  vurdering: Vurdering;
}
