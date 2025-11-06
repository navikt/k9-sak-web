import type { BeriketHistorikkInnslag } from '../historikkTypeBerikning.js';

export interface FeiletHistorikkKall {
  readonly backend: 'k9-sak' | 'k9-tilbake' | 'k9-klage' | 'ung-sak' | 'ung-tilbake';
  readonly error: Error;
}

export interface HentetHistorikk {
  readonly innslag: ReadonlyArray<BeriketHistorikkInnslag>;
  readonly feilet: ReadonlyArray<FeiletHistorikkKall>;
}

export interface HistorikkBackendApi {
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
