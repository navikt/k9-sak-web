import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';

export interface VedtakKlageApi {
  /**
   * Brukast i queryKey i useQuery kall for å sikre at query blir oppfriska viss backend blir endra.
   */
  readonly backend: 'ung' | 'k9klage';
  forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto, fagsak: FagsakDto): Promise<Blob>;
  getKlageVurdering(behandlingUuid: string): Promise<KlagebehandlingDto>;
}
