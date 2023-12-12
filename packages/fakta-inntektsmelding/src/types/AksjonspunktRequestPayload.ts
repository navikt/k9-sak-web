interface Perioder {
  periode: string;
  fortsett: boolean;
  begrunnelse?: string;
  kode: string;
}

interface AksjonspunktRequestPayload {
  begrunnelse?: string;
  perioder: Perioder[];
  kode: string;
  '@type': string;
}

export default AksjonspunktRequestPayload;
