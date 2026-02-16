import type { DokumentLink } from '@k9-sak-web/backend/combined/behandling/historikk/DokumentLink.js';
import type { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import type {
  HistorikkinnslagDto,
  HistorikkinnslagDtoLinje,
} from '@k9-sak-web/backend/combined/kontrakt/historikk/HistorikkinnslagDto.js';

// Denne fila beriker genererte historikk dto typer slik at dei fungerer betre i frontend (unngår masse kodeverk oppslag der).
// Lager "berikede" type der skjermlenke og aktør fra server får lagt til navn fra kodeverkoppslag.
export type SkjermlenkeMedNavn = Readonly<{
  type: SkjermlenkeType;
  navn: string;
}>;

export type AktørMedNavn = HistorikkinnslagDto['aktør'] &
  Readonly<{
    navn: string;
  }>;

export type BeriketHistorikkInnslagLinje = Omit<HistorikkinnslagDtoLinje, 'skjermlenke'> &
  Readonly<{
    skjermlenke?: SkjermlenkeMedNavn;
  }>;

export type BeriketDokumentLink = DokumentLink &
  Readonly<{
    serverUrl: string;
  }>;

export type BeriketHistorikkInnslag = Omit<HistorikkinnslagDto, 'skjermlenke' | 'dokumenter'> &
  Readonly<{
    aktør: AktørMedNavn;
    skjermlenke?: SkjermlenkeMedNavn;
    dokumenter: BeriketDokumentLink[];
  }>;

export interface FeiletHistorikkKall {
  readonly backend: 'k9-sak' | 'k9-tilbake' | 'k9-klage' | 'ung-sak' | 'ung-tilbake';
  readonly error: Error;
}

export interface HentetHistorikk {
  readonly innslag: ReadonlyArray<BeriketHistorikkInnslag>;
  readonly feilet: ReadonlyArray<FeiletHistorikkKall>;
}

export interface HistorikkBackendApi {
  readonly backend: 'k9' | 'ung';
  hentAlleInnslag(saksnummer: string): Promise<HentetHistorikk>;
}

export const fangFeilVedHenting = async (
  backend: FeiletHistorikkKall['backend'],
  innslagPromise: Promise<BeriketHistorikkInnslag[]>,
): Promise<HentetHistorikk> => {
  try {
    const innslag = await innslagPromise;
    return {
      innslag,
      feilet: [],
    };
  } catch (e) {
    const feilet: FeiletHistorikkKall[] = [
      {
        backend,
        error: e instanceof Error ? e : new Error(`${e}`),
      },
    ];
    return {
      innslag: [],
      feilet,
    };
  }
};

/**
 * Legger på utleda serverUrl for dokument i historikk innslag
 * @param serverDokumentEndepunkt Statisk verdi for endepunkt
 */
export const dokumentMedServerUrl = (
  serverDokumentEndepunkt: string,
  saksnummer: string,
  innslag: HistorikkinnslagDto,
): BeriketDokumentLink[] => {
  return innslag.dokumenter.map(dokument => {
    const { journalpostId, dokumentId } = dokument;
    const serverUrl = `${serverDokumentEndepunkt}?saksnummer=${saksnummer}&journalpostId=${journalpostId}&dokumentId=${dokumentId}`;
    return {
      ...dokument,
      serverUrl,
    };
  });
};
