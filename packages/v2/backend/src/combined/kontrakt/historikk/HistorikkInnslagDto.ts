import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2 as K9SakHistorikkinnslagDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2 as K9KlageHistorikkinnslagDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto as K9TilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type {
  ung_sak_kontrakt_historikk_HistorikkinnslagDto,
  ung_sak_kontrakt_historikk_HistorikkinnslagDto_Linje,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type {
  sif_tilbakekreving_historikk_HistorikkinnslagDto,
  sif_tilbakekreving_historikk_HistorikkinnslagDto_Linje,
} from '@k9-sak-web/backend/ungtilbake/generated/types.js';

import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_Linje as GeneratedK9SakLinje } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2_Linje as GeneratedK9KlageLinje } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto_Linje as GeneratedK9TilbakeLinje } from '@k9-sak-web/backend/k9tilbake/generated/types.js';

export type HistorikkInnslagDto =
  | K9SakHistorikkinnslagDto
  | K9KlageHistorikkinnslagDto
  | K9TilbakeHistorikkinnslagDto
  | ung_sak_kontrakt_historikk_HistorikkinnslagDto
  | sif_tilbakekreving_historikk_HistorikkinnslagDto;

export type HistorikkInnslagDtoLinje =
  | GeneratedK9SakLinje
  | GeneratedK9KlageLinje
  | GeneratedK9TilbakeLinje
  | ung_sak_kontrakt_historikk_HistorikkinnslagDto_Linje
  | sif_tilbakekreving_historikk_HistorikkinnslagDto_Linje;
