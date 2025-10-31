import type { k9_klage_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { ung_sak_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface VedtakKlageApi {
  /**
   * Brukast i queryKey i useQuery kall for å sikre at query blir oppfriska viss backend blir endra.
   */
  readonly backend: 'ung' /* | 'k9' */; // k9 backend kan leggast til i framtida. typer brukt i interface må då vere union av ung og k9 sine typer

  forhåndsvisKlageVedtaksbrev(behandlingId: number): Promise<Blob>;
  getKlageVurdering(
    behandlingUuid: string,
  ): Promise<ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto>;
}
