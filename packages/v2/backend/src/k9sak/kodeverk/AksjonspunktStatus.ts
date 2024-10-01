import type { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';

export type AksjonspunktStatus = Exclude<AksjonspunktDto['status'], undefined>;

export type AksjonspunktStatusName = 'AVBRUTT' | 'OPPRETTET' | 'UTFORT';

export const aksjonspunktStatus: Readonly<Record<AksjonspunktStatusName, AksjonspunktStatus>> = {
  OPPRETTET: 'OPPR',
  UTFORT: 'UTFO',
  AVBRUTT: 'AVBR',
};
