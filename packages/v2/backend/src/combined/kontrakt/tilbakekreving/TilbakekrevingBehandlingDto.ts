import type { BehandlingsresultatDto as K9BehandlingsresultatDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/behandling/BehandlingsresultatDto.js';
import type { BehandlingÅrsakDto as K9BehandlingÅrsakDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/behandling/BehandlingÅrsakDto.js';
import type { TilbakekrevingValgDto as K9TilbakekrevingValgDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/behandling/TilbakekrevingValgDto.js';
import type { BehandlingsresultatDto as UngBehandlingsresultatDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/behandling/BehandlingsresultatDto.js';
import type { BehandlingÅrsakDto as UngBehandlingÅrsakDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/behandling/BehandlingÅrsakDto.js';
import type { TilbakekrevingValgDto as UngTilbakekrevingValgDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/behandling/TilbakekrevingValgDto.js';

export type TilbakekrevingValgDto = K9TilbakekrevingValgDto | UngTilbakekrevingValgDto;
export type BehandlingsresultatDto = K9BehandlingsresultatDto | UngBehandlingsresultatDto;
export type BehandlingÅrsakDto = K9BehandlingÅrsakDto | UngBehandlingÅrsakDto;
