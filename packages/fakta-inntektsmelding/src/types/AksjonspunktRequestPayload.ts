import { Kode } from './KompletthetData';

export interface Perioder {
  periode: string;
  fortsett: boolean;
  begrunnelse?: string;
  kode: string;
  vurdering?: Kode;
}

interface AksjonspunktRequestPayload {
  begrunnelse?: string;
  perioder: Perioder[];
  kode: string;
  '@type': string;
}

export default AksjonspunktRequestPayload;
