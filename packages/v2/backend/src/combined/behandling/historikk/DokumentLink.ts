import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_DokumentLink } from '../../../k9sak/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkInnslagDokumentLinkDto } from '../../../k9tilbake/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2_DokumentLink } from '../../../k9klage/generated/types.js';
import type { ung_sak_kontrakt_historikk_HistorikkInnslagDokumentLinkDto } from '../../../ungsak/generated/types.js';

export type DokumentLink =
  | k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_DokumentLink
  | k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2_DokumentLink
  | foreldrepenger_tilbakekreving_historikk_HistorikkInnslagDokumentLinkDto
  | ung_sak_kontrakt_historikk_HistorikkInnslagDokumentLinkDto;
