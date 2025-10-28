import type {
  ung_sak_kontrakt_klage_KlagebehandlingDto,
  ung_sak_web_app_tjenester_klage_KlageRestTjeneste_AbacKlageVurderingResultatAksjonspunktMellomlagringDto as MellomlagringDataDto,
  ung_sak_kontrakt_klage_KlageHjemmelDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface KlageVurderingApi {
  readonly backend: 'ung' /* | 'k9' */; // k9 backend kan leggast til i framtida. typer brukt i interface må då vere union av ung og k9 sine typer

  forhåndsvisKlageVedtaksbrev(behandlingId: number): Promise<Blob>;
  getKlageVurdering(behandlingUuid: string): Promise<ung_sak_kontrakt_klage_KlagebehandlingDto>;
  mellomlagreKlage(data: MellomlagringDataDto): Promise<void>;
  hentValgbareKlagehjemler(): Promise<ung_sak_kontrakt_klage_KlageHjemmelDto[]>;
}
