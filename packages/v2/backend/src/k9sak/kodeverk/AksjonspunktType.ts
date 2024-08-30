import type { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import type { Kodeverk } from '../../shared/Kodeverk.ts';

export type AksjonspunktType = Exclude<AksjonspunktDto['status'], undefined>;

export type AksjonspunktTypeKodeverk = Kodeverk<AksjonspunktType, 'AKSJONSPUNKT_TYPE'>;

export type AksjonspunktTypeName = 'AVBRUTT' | 'OPPRETTET' | 'UTFORT';

export const aksjonspunktType: Readonly<Record<AksjonspunktTypeName, AksjonspunktType>> = {
  OPPRETTET: 'OPPR',
  UTFORT: 'UTFO',
  AVBRUTT: 'AVBR',
};
