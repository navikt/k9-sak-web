import type { Historikkinnslag } from '@k9-sak-web/types';
import type { TilbakeHistorikkInnslagV2 } from '@k9-sak-web/gui/sak/historikk/historikkTypeBerikning.js';

export type SakHistorikkInnslagV1 = Historikkinnslag & {
  erKlage?: never;
  erTilbakekreving?: never;
  erSak: boolean;
};

export type KlageHistorikkInnslagV1 = Historikkinnslag & {
  erKlage: boolean;
  erTilbakekreving?: never;
  erSak?: never;
};

export type EtablerteUlikeHistorikkinnslagTyper =
  | SakHistorikkInnslagV1
  | KlageHistorikkInnslagV1
  | TilbakeHistorikkInnslagV2;
