import type { k9_sak_kontrakt_kompletthet_aksjonspunkt_KompletthetsPeriode } from '@navikt/k9-sak-typescript-client/types';

export type KompletthetsPeriode = k9_sak_kontrakt_kompletthet_aksjonspunkt_KompletthetsPeriode;

export interface AksjonspunktRequestPayload {
  begrunnelse?: string;
  perioder: KompletthetsPeriode[];
  kode: string;
  '@type': string;
}

export default AksjonspunktRequestPayload;
