import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface VedtakKlageApi extends BackendTilhørighet<'ungsak' | 'k9klage'> {
  forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto, fagsak: FagsakDto): Promise<Blob>;
  getKlageVurdering(behandlingUuid: string): Promise<KlagebehandlingDto>;
}
