import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as K9SakBehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as K9TilbakeBehandlingDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as UngSakBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as UngTilbakeBehandlingDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/behandling/BehandlingDto.js';

export type BehandlingDto =
  | K9KlageBehandlingDto
  | K9SakBehandlingDto
  | K9TilbakeBehandlingDto
  | UngSakBehandlingDto
  | UngTilbakeBehandlingDto;
