import type { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import type { Kodeverk } from '../../shared/Kodeverk.ts';

export type AksjonspunktStatus = Exclude<AksjonspunktDto['status'], undefined>;

export type AksjonspunktStatusKodeverk = Kodeverk<AksjonspunktStatus, 'AKSJONSPUNKT_TYPE'>;

export type AksjonspunktStatusName = 'AVBRUTT' | 'OPPRETTET' | 'UTFORT';

export const aksjonspunktStatus: Readonly<Record<AksjonspunktStatusName, AksjonspunktStatus>> = {
  OPPRETTET: 'OPPR',
  UTFORT: 'UTFO',
  AVBRUTT: 'AVBR',
};
