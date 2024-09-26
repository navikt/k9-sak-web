import type { VilkårDto } from '@navikt/k9-sak-typescript-client';
import type { Kodeverk } from '../../../shared/Kodeverk.ts';

export type VilkårStatus = Exclude<VilkårDto['vilkarStatus'], undefined>;

export type VilkårStatusKodeverk = Kodeverk<VilkårStatus, 'VILKAR_STATUS'>;

export const vilkårStatus: Readonly<Record<VilkårStatus, VilkårStatus>> = {
  OPPFYLT: 'OPPFYLT',
  IKKE_OPPFYLT: 'IKKE_OPPFYLT',
  IKKE_VURDERT: 'IKKE_VURDERT',
  IKKE_RELEVANT: 'IKKE_RELEVANT',
  UDEFINERT: 'UDEFINERT',
};
