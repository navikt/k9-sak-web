import { Status, Vurdering } from './KompletthetData';

export interface Kompletthet {
  tilstand: Tilstand[];
}
interface Tilstand {
  periode: string;
  status: Status[];
  tilVurdering: boolean;
  begrunnelse: string;
  vurdering: Vurdering;
  vurdertAv?: string;
  vurdertTidspunkt?: string;
}
