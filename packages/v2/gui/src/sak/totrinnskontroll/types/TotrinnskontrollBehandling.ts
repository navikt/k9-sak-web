import type { k9_klage_kontrakt_behandling_BehandlingDto as KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_BehandlingDto as TilbakeBehandlingDto } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { ung_sak_kontrakt_behandling_BehandlingDto as UngBehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { sif_tilbakekreving_web_app_tjenester_behandling_dto_BehandlingDto as UngTilbakeBehandlingDto } from '@k9-sak-web/backend/ungtilbake/generated/types.js';

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
