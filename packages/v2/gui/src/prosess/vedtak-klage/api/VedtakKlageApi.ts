import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { k9_klage_kontrakt_behandling_part_PartDto } from '@k9-sak-web/backend/k9klage/generated/types.js';

export interface VedtakKlageApi {
  /**
   * Brukast i queryKey i useQuery kall for å sikre at query blir oppfriska viss backend blir endra.
   */
  readonly backend: 'ung' | 'k9klage';
  forhåndsvisKlageVedtaksbrev(behandlingId: number, data?: ForhåndsvisDto): Promise<Blob>;
  getKlageVurdering(behandlingUuid: string): Promise<KlagebehandlingDto>;
  hentValgtKlagendePart?(behandlingUuid: string): Promise<k9_klage_kontrakt_behandling_part_PartDto>;
}
