import type { BehandlingDto } from '@navikt/k9-sak-typescript-client';

export type BehandlingStatus = Exclude<BehandlingDto['status'], undefined>;

export type BehandlingStatusName =
  | 'OPPRETTET'
  | 'BEHANDLING_UTREDES'
  | 'AVSLUTTET'
  | 'IVERKSETTER_VEDTAK'
  | 'FATTER_VEDTAK';

export const BehandlingStatus: Readonly<Record<BehandlingStatusName, BehandlingStatus>> = {
  OPPRETTET: 'OPPRE',
  BEHANDLING_UTREDES: 'UTRED',
  AVSLUTTET: 'AVSLU',
  IVERKSETTER_VEDTAK: 'IVED',
  FATTER_VEDTAK: 'FVED',
};
