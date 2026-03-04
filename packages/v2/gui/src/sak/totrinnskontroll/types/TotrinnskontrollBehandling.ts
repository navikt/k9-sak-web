import type { KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/KlageBehandlingDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { TilbakeBehandlingDto } from '@k9-sak-web/backend/k9tilbake/tjenester/behandling/TilbakeBehandlingDto.js';
import type { UngBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/UngBehandlingDto.js';
import type { UngTilbakeBehandlingDto } from '@k9-sak-web/backend/ungtilbake/tjenester/behandling/UngTilbakeBehandlingDto.js';

// Overstyrer generert type til å ha not null på nokre properties. For å sleppe å gjere endringer i fptilbake kodebase.
type AdjustedTilbakeBehandlingDto = TilbakeBehandlingDto &
  Pick<Required<TilbakeBehandlingDto>, 'status' | 'type' | 'uuid'>;

type CombinedBehandling =
  | KlageBehandlingDto
  | BehandlingDto
  | AdjustedTilbakeBehandlingDto
  | UngBehandlingDto
  | UngTilbakeBehandlingDto;

type BehandlingsresultatType = Required<CombinedBehandling>['behandlingsresultat']['type'];

export type TotrinnskontrollBehandling = Pick<
  CombinedBehandling,
  'status' | 'toTrinnsBehandling' | 'type' | 'id' | 'uuid' | 'versjon'
> & {
  behandlingsresultatType: BehandlingsresultatType;
};
