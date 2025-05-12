import type { Historikkinnslag } from '@k9-sak-web/types';
import type { HistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9sak/generated';
import type { HistorikkinnslagV2 as TilbakeHistorikkinnslagV2 } from '@k9-sak-web/gui/sak/historikk/tilbake/historikkinnslagTsTypeV2.js';

export type SakHistorikkInnslagV1 = Historikkinnslag & {
  erKlage?: never;
  erTilbakekreving?: never;
  erSak: boolean;
};

export type SakHistorikkInnslagV2 = HistorikkinnslagDtoV2 & {
  erKlage?: never;
  erTilbakekreving?: never;
  erSak: boolean;
};

export type KlageHistorikkInnslagV1 = Historikkinnslag & {
  erKlage: boolean;
  erTilbakekreving?: never;
  erSak?: never;
};

export type TilbakeHistorikkInnslagV2 = TilbakeHistorikkinnslagV2 & {
  erKlage?: never;
  erTilbakekreving: boolean;
  erSak?: never;
};

export type EtablerteUlikeHistorikkinnslagTyper =
  | SakHistorikkInnslagV1
  | KlageHistorikkInnslagV1
  | TilbakeHistorikkInnslagV2;
export type NyeUlikeHistorikkinnslagTyper = SakHistorikkInnslagV2 | KlageHistorikkInnslagV1 | TilbakeHistorikkInnslagV2;
