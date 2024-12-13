import {
  behandlingStatus as generatedBehandlingStatus,
  type behandlingStatus as generatedBehandlingStatusType,
} from '@navikt/k9-sak-typescript-client';

export type BehandlingStatus = generatedBehandlingStatusType;

export type BehandlingStatusName =
  | 'OPPRETTET'
  | 'BEHANDLING_UTREDES'
  | 'AVSLUTTET'
  | 'IVERKSETTER_VEDTAK'
  | 'FATTER_VEDTAK';

export const BehandlingStatus: Readonly<Record<BehandlingStatusName, BehandlingStatus>> = {
  OPPRETTET: generatedBehandlingStatus.OPPRE,
  BEHANDLING_UTREDES: generatedBehandlingStatus.UTRED,
  AVSLUTTET: generatedBehandlingStatus.AVSLU,
  IVERKSETTER_VEDTAK: generatedBehandlingStatus.IVED,
  FATTER_VEDTAK: generatedBehandlingStatus.FVED,
};
