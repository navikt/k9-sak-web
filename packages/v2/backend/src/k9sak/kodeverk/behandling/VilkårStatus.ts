import type { VilkårDto } from '@navikt/k9-sak-typescript-client';
import type { Kodeverk } from '../../../shared/Kodeverk.ts';

export type VilkårStatus = Exclude<VilkårDto['vilkarStatus'], undefined>;

export type VilkårStatusKodeverk = Kodeverk<VilkårStatus, 'VILKAR_STATUS'>;

export type VilkårStatusName = 'IKKE_OPPFYLT' | 'IKKE_VURDERT' | 'OPPFYLT' | 'IKKE_RELEVANT' | 'UDEFINERT';

export const vilkårStatus: Readonly<Record<VilkårStatusName, VilkårStatus>> = {
  OPPFYLT: 'OPPFYLT',
  IKKE_OPPFYLT: 'IKKE_OPPFYLT',
  IKKE_VURDERT: 'IKKE_VURDERT',
  IKKE_RELEVANT: 'IKKE_RELEVANT',
  UDEFINERT: 'UDEFINERT',
};
