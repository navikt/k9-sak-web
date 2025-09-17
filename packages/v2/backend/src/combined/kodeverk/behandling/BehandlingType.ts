import {
  behandlingType as behandlingTypeK9Klage,
  type BehandlingType as BehandlingTypeK9Klage,
} from '../../../k9klage/kodeverk/behandling/BehandlingType.js';
import {
  behandlingType as behandlingTypeK9Sak,
  type BehandlingType as BehandlingTypeK9Sak,
} from '../../../k9sak/kodeverk/behandling/BehandlingType.js';
import { foreldrepenger_tilbakekreving_behandlingslager_behandling_BehandlingType as behandlingTypeK9Tilbake } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { Kodeverk } from '../../../shared/Kodeverk.js';
import { safeConstCombine } from '../../../typecheck/safeConstCombine.js';

export type BehandlingType = BehandlingTypeK9Sak | BehandlingTypeK9Klage | behandlingTypeK9Tilbake;

export const BehandlingType = safeConstCombine(behandlingTypeK9Sak, behandlingTypeK9Klage, behandlingTypeK9Tilbake);

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

const values: string[] = [
  ...Object.values(behandlingTypeK9Sak),
  ...Object.values(behandlingTypeK9Klage),
  ...Object.values(behandlingTypeK9Tilbake),
];

export const isBehandlingType = (t: string): t is BehandlingType => values.includes(t);
