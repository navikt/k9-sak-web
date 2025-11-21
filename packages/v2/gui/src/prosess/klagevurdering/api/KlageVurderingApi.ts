import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { MellomlagringDto } from '@k9-sak-web/backend/combined/kontrakt/mellomlagring/MellomlagringDto.js';
import type { ung_sak_kontrakt_klage_KlageHjemmelDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface KlageVurderingApi {
  /**
   * Brukast i queryKey i useQuery kall for å sikre at query blir oppfriska viss backend blir endra.
   */
  readonly backend: 'ung' | 'k9klage';

  forhåndsvisKlageVedtaksbrev?(behandlingId: number): Promise<Blob>;
  getKlageVurdering(behandlingUuid: string): Promise<KlagebehandlingDto>;
  mellomlagreKlage(data: MellomlagringDto): Promise<void>;
  hentValgbareKlagehjemlerForUng?(): Promise<ung_sak_kontrakt_klage_KlageHjemmelDto[]>;
}
