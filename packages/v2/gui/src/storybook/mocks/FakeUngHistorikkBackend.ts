import {
  fangFeilVedHenting,
  type HentetHistorikk,
  type HistorikkBackendApi,
} from '../../sak/historikk/api/HistorikkBackendApi.js';
import { type BeriketHistorikkInnslag } from '../../sak/historikk/api/HistorikkBackendApi.js';
import type { HistorikkinnslagDto } from '@k9-sak-web/backend/ungsak/kontrakt/historikk/HistorikkinnslagDto.js';
import type { HistorikkinnslagDto as TilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/historikk/HistorikkinnslagDto.js';
import { UngHistorikkInnslagBeriker } from '../../sak/historikk/api/UngHistorikkInnslagBeriker.js';
import type { UngKodeverkoppslag } from '../../kodeverk/oppslag/useUngKodeverkoppslag.js';

const fakeUngSakResponse: HistorikkinnslagDto[] = [
  {
    behandlingUuid: '1adbd9e0-33c9-40c4-a870-0ad2f4526a54',
    aktør: {
      type: 'SBH',
      ident: 'Z990404',
    },
    opprettetTidspunkt: '2025-11-28T10:11:35.262',
    dokumenter: [],
    tittel: 'Fakta endret',
    skjermlenke: 'BISTANDSVILKÅR',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Gjeldende fra __22.09.2025__: Ingen endring av vurdering',
      },
      {
        type: 'TEKST',
        tekst: 'tester',
      },
    ],
    historikkinnslagUuid: '4c693516-751f-496f-9bdf-2166a3128d4c',
  },
  {
    behandlingUuid: '1adbd9e0-33c9-40c4-a870-0ad2f4526a54',
    aktør: {
      type: 'LOKALKONTOR_SBH',
      ident: 'Z990404',
    },
    opprettetTidspunkt: '2025-11-28T10:00:38.993',
    dokumenter: [],
    tittel: 'Lokalkontor endring',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Gjeldende fra __27.10.2025__:',
      },
      {
        type: 'TEKST',
        tekst: '__Har godkjent alle inngangsvilkår__.',
      },
    ],
    historikkinnslagUuid: '06c02e20-2cdf-4b7e-b38a-ead86d7840c2',
  },
  {
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'LOKALKONTOR_BESL',
      ident: 'B123456',
    },
    skjermlenke: 'VEDTAK',
    opprettetTidspunkt: '2026-01-12T11:40:35.504',
    dokumenter: [],
    tittel: 'Vedtak fattet: Innvilget',
    linjer: [],
    historikkinnslagUuid: 'f917a32f-8025-4a27-b5a3-989643e5c6fb',
  },
  {
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2026-01-12T11:38:55.428',
    dokumenter: [],
    tittel: 'Behandling gjenopptatt',
    linjer: [],
    historikkinnslagUuid: '6854aa6a-d33d-45ac-9994-419f7aa06fef',
  },
  {
    aktør: {
      type: 'ARBEIDSGIVER',
    },
    opprettetTidspunkt: '2026-01-12T11:38:55.208',
    dokumenter: [
      {
        tag: 'Inntektsmelding',
        utgått: false,
        journalpostId: '112102504',
        dokumentId: '112102506',
      },
    ],
    tittel: 'Vedlegg mottatt',
    linjer: [],
    historikkinnslagUuid: 'abfcbe90-f6f1-4565-8ae6-99be7590b005',
  },
  {
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2026-01-12T11:38:54.64',
    dokumenter: [],
    tittel: 'Inntektsmelding bestilt fra arbeidsgiver',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Oppgave til BEDRIFT AS om å sende inntektsmelding for skjæringstidspunkt 2025-12-15',
      },
    ],
    historikkinnslagUuid: '2a12ba33-f0ae-41e2-8324-140dcef1db9f',
  },
  {
    aktør: {
      type: 'SOKER',
    },
    opprettetTidspunkt: '2026-01-12T11:38:52.472',
    dokumenter: [
      {
        tag: 'Søknad',
        utgått: false,
        journalpostId: '112102503',
        dokumentId: '112102504',
      },
      {
        tag: 'Vedlegg',
        utgått: false,
        journalpostId: '112102503',
        dokumentId: '112102505',
      },
    ],
    tittel: 'Vedlegg mottatt',
    linjer: [],
    historikkinnslagUuid: 'e0124d7c-06c2-4781-b923-e81145e37759',
  },
];

const fakeUngTilbakeResponse: TilbakeHistorikkinnslagDto[] = [
  {
    behandlingUuid: 'd4a81220-5e8d-41db-bbee-436ee5ef1174',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-02-27T17:40:48.434',
    dokumenter: [
      {
        tag: 'Varselbrev Tilbakekreving',
        journalpostId: '227173608',
        dokumentId: '227173611',
        utgått: false,
      },
    ],
    tittel: 'Brev er sendt',
    linjer: [],
  },
  {
    behandlingUuid: 'd4a81220-5e8d-41db-bbee-436ee5ef1174',
    aktør: {
      type: 'SBH',
      ident: 'S123456',
    },
    opprettetTidspunkt: '2025-02-27T17:40:48.883',
    dokumenter: [],
    tittel: 'Behandlingen er gjenopptatt',
    linjer: [],
  },
  {
    behandlingUuid: 'd4a81220-5e8d-41db-bbee-436ee5ef1174',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-03-31T13:28:16.269',
    dokumenter: [],
    tittel: 'Behandlingen er satt på vent 22.04.2025',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Venter på tilbakemelding fra bruker.',
      },
    ],
  },
  {
    behandlingUuid: 'd4a81220-5e8d-41db-bbee-436ee5ef1174',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-08-29T10:41:30.155',
    dokumenter: [],
    tittel: 'Behandling er gjenopptatt',
    linjer: [],
  },
  {
    behandlingUuid: 'd4a81220-5e8d-41db-bbee-436ee5ef1174',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-02-27T17:40:42.779',
    dokumenter: [],
    tittel: 'Tilbakekreving opprettet',
    linjer: [],
    skjermlenke: 'TILBAKEKREVING',
  },
];

export class FakeUngHistorikkBackend implements HistorikkBackendApi {
  #beriker: UngHistorikkInnslagBeriker;

  readonly backend = 'ung';

  constructor(kodeverkoppslag: UngKodeverkoppslag) {
    this.#beriker = new UngHistorikkInnslagBeriker(kodeverkoppslag);
  }

  async #hentAlleInnslagUngsak(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return Promise.resolve(fakeUngSakResponse.map(innslag => this.#beriker.berikSakInnslag(innslag, saksnummer)));
  }

  async #hentAlleInnslagUngtilbake(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return Promise.resolve(
      fakeUngTilbakeResponse.map(innslag => this.#beriker.berikTilbakeInnslag(innslag, saksnummer)),
    );
  }

  async hentAlleInnslag(saksnummer: string): Promise<HentetHistorikk> {
    const ungSak = await fangFeilVedHenting('ung-sak', this.#hentAlleInnslagUngsak(saksnummer));
    const ungTilbake = await fangFeilVedHenting('ung-tilbake', this.#hentAlleInnslagUngtilbake(saksnummer));
    return {
      innslag: [...ungSak.innslag, ...ungTilbake.innslag],
      feilet: [...ungSak.feilet, ...ungTilbake.feilet],
    };
  }
}
