// TODO Få til overgang til kodeverk som string enums på disse typer.

import type { Kodeverk } from '@k9-sak-web/backend/shared/Kodeverk.ts';

export const historikkAktor = {
  BESLUTTER: 'BESL',
  SAKSBEHANDLER: 'SBH',
  SOKER: 'SOKER',
  ARBEIDSGIVER: 'ARBEIDSGIVER',
  VEDTAKSLOSNINGEN: 'VL',
} as const;

// i fp-frontend er HistorikkAktor type definert som string tilsvarande denne
export type HistorikkAktorStringUnion = (typeof historikkAktor)[keyof typeof historikkAktor];
// k9-tilbake får framleis alltid kodeverdi serialisert som objekt, fp-tilbake som string, så denne må vere definert
// forskjellig frå fp-frontend sin definisjon
export type HistorikkAktor = Kodeverk<HistorikkAktorStringUnion, 'HISTORIKK_AKTOER'>;

export type HistorikkInnslagDokumentLink = Readonly<{
  dokumentId?: string;
  journalpostId?: string;
  tag: string;
  utgått: boolean;
}>;

type Linje =
  | {
      type: 'TEKST';
      tekst: string;
    }
  | {
      type: 'LINJESKIFT';
      tekst: null;
    };

export type HistorikkinnslagV2 = Readonly<{
  aktør: HistorikkUtfører;
  opprettetTidspunkt: string;
  behandlingUuid: string;
  skjermlenke?: Kodeverk<string, 'SKJERMLENKE_TYPE'> | null; // skal returnerast som string i framtida
  dokumenter?: HistorikkInnslagDokumentLink[] | null;
  tittel: string | null;
  linjer: Linje[];
}>;

export type HistorikkUtfører = {
  type: HistorikkAktor;
  ident: string | null;
};
