import type { HentAlleInnslagV2Response } from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  fangFeilVedHenting,
  type HentetHistorikk,
  type HistorikkBackendApi,
} from '../../sak/historikk/api/HistorikkBackendApi.js';
import { type BeriketHistorikkInnslag } from '../../sak/historikk/api/HistorikkBackendApi.js';
import { K9HistorikkInnslagBeriker } from '../../sak/historikk/api/K9HistorikkInnslagBeriker.js';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2 as KlageHistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto as TilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/k9tilbake/generated/types.js';

// Kopi av respons frå k9-sak backend i dev
const fakeK9SakResponse: HentAlleInnslagV2Response = [
  {
    behandlingId: 1045402,
    behandlingUuid: '1adbd9e0-33c9-40c4-a870-0ad2f4526a54',
    aktør: {
      type: 'SBH',
      ident: 'Z990404',
    },
    opprettetTidspunkt: '2025-11-28T10:11:35.262',
    dokumenter: [],
    tittel: 'Fakta endret',
    skjermlenke: 'BEREGNING',
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
    uuid: '4c693516-751f-496f-9bdf-2166a3128d4c',
  },
  {
    behandlingId: 1045402,
    behandlingUuid: '1adbd9e0-33c9-40c4-a870-0ad2f4526a54',
    aktør: {
      type: 'SBH',
      ident: 'Z990404',
    },
    opprettetTidspunkt: '2025-11-28T10:00:38.993',
    dokumenter: [],
    tittel: 'Fakta endret',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Gjeldende fra __27.10.2025__:',
      },
      {
        type: 'TEKST',
        tekst: '__Inntekt fra LEI TYKKHUDET TIGER AS (312383985)__ er satt til __480 000__.',
      },
      {
        type: 'TEKST',
        tekst: '__Inntekt fra GENIERKLÆRT STRIDLYNT KATT SKYVEDØR (315227569)__ er satt til __300 000__.',
      },
    ],
    uuid: '06c02e20-2cdf-4b7e-b38a-ead86d7840c2',
  },

  {
    behandlingId: 3000001,
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'BESL',
      ident: 'B123456',
    },
    skjermlenke: 'VEDTAK',
    opprettetTidspunkt: '2026-01-12T11:40:35.504',
    dokumenter: [],
    tittel: 'Vedtak fattet: Innvilget',
    linjer: [],
    uuid: 'f917a32f-8025-4a27-b5a3-989643e5c6fb',
  },
  {
    behandlingId: 3000001,
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'SBH',
      ident: 'S123456',
    },
    skjermlenke: 'VEDTAK',
    opprettetTidspunkt: '2026-01-12T11:40:11.224',
    dokumenter: [],
    tittel: 'Vedtak foreslått og sendt til beslutter: Innvilget',
    linjer: [],
    uuid: '6eb16967-de37-401c-89b2-8b18373629fb',
  },
  {
    behandlingId: 3000001,
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'SBH',
      ident: 'S123456',
    },
    skjermlenke: 'FAKTA_OM_MEDLEMSKAP',
    opprettetTidspunkt: '2026-01-12T11:39:46.099',
    dokumenter: [],
    tittel: 'Fakta endret',
    linjer: [
      {
        type: 'TEKST',
        tekst: '__Vurder om søker har gyldig medlemskap i perioden__ er satt til __Periode med medlemskap__.',
      },
      {
        type: 'TEKST',
        tekst: 'asdasdad',
      },
    ],
    uuid: 'b6d5dfa9-125a-45ab-a156-5b287924149a',
  },
  {
    behandlingId: 3000001,
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'SBH',
      ident: 'S123456',
    },
    skjermlenke: 'PUNKT_FOR_MEDISINSK',
    opprettetTidspunkt: '2026-01-12T11:39:38.694',
    dokumenter: [],
    tittel: 'Fakta endret',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Sykdom manuelt behandlet.',
      },
    ],
    uuid: '9fcec839-191c-419c-a5fe-1cdaa93694b4',
  },
  {
    behandlingId: 3000001,
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2026-01-12T11:38:55.428',
    dokumenter: [],
    tittel: 'Behandling gjenopptatt',
    linjer: [],
    uuid: '6854aa6a-d33d-45ac-9994-419f7aa06fef',
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
    uuid: 'abfcbe90-f6f1-4565-8ae6-99be7590b005',
  },
  {
    behandlingId: 3000001,
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
    uuid: '2a12ba33-f0ae-41e2-8324-140dcef1db9f',
  },
  {
    behandlingId: 3000001,
    behandlingUuid: 'd7c89e5b-ed48-40c8-8fc9-8c6faca4de28',
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2026-01-12T11:38:54.529',
    dokumenter: [],
    tittel: 'Behandling på vent: 19.01.2026',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Venter på inntektsmeldinger etter etterlysning',
      },
    ],
    uuid: '0551bc81-54cb-4a20-9720-16048d785397',
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
    uuid: 'e0124d7c-06c2-4781-b923-e81145e37759',
  },
];

const fakeK9KlageResponse: KlageHistorikkinnslagDtoV2[] = [
  {
    behandlingId: 999952,
    aktør: {
      type: 'SBH',
      ident: 'S123456',
    },
    opprettetTidspunkt: '2025-05-06T11:16:01.228',
    dokumenter: [],
    tittel: 'Behandling er henlagt',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Henlagt, søknaden er feilopprettet',
      },
      {
        type: 'TEKST',
        tekst: 'Henlegger fra verdikjedetest',
      },
    ],
    uuid: '0e722618-9b62-4935-a261-c7895ead7d9f',
  },
  {
    behandlingId: 999952,
    aktør: {
      type: 'SBH',
      ident: 'S123456',
    },
    opprettetTidspunkt: '2025-05-06T11:16:00.607',
    dokumenter: [],
    tittel: 'Klagebehandling Vedtaksinstans',
    linjer: [
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
      },
      {
        type: 'TEKST',
        tekst: '__Vedtaket som er påklagd__ er satt til __Førstegangsbehandling 06.05.2025__.',
      },
      {
        type: 'TEKST',
        tekst: '__Er klager part i saken__ er satt til __Ja__.',
      },
      {
        type: 'TEKST',
        tekst: '__Er klagefristen overholdt__ er satt til __Ja__.',
      },
      {
        type: 'TEKST',
        tekst: '__Er klagen signert__ er satt til __Ja__.',
      },
      {
        type: 'TEKST',
        tekst: '__Klages det på konkrete elementer i vedtaket__ er satt til __Ja__.',
      },
      {
        type: 'TEKST',
        tekst: 'autotest',
      },
    ],
    uuid: 'd2d54535-8f0c-424e-8dfd-621a750bdb4c',
  },
  {
    behandlingId: 999952,
    aktør: {
      type: 'SOKER',
    },
    opprettetTidspunkt: '2025-05-06T11:15:54.829',
    dokumenter: [],
    tittel: 'Behandling startet',
    linjer: [
      {
        type: 'TEKST',
        tekst: '__Klage mottatt__',
      },
    ],
    uuid: 'b62d9bb8-8f1b-446d-8861-67a593c0507c',
  },
];

// Kopiert ut frå verdikjede (og redusert litt), frå sak oppretta av test
// TrekkAvKravMedTilbakekrevingTest.psb_trekk_av_krav_etter_at_perioden_er_godkjent_utbetalt
const fakeK9TilbakeResponse: TilbakeHistorikkinnslagDto[] = [
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

export class FakeHistorikkBackend implements HistorikkBackendApi {
  #beriker: K9HistorikkInnslagBeriker;

  readonly backend = 'k9';

  constructor(kodeverkoppslag: K9Kodeverkoppslag) {
    this.#beriker = new K9HistorikkInnslagBeriker(kodeverkoppslag);
  }

  async #hentAlleInnslagK9sak(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return Promise.resolve(fakeK9SakResponse.map(innslag => this.#beriker.berikSakInnslag(innslag, saksnummer)));
  }

  async #hentAlleInnslagK9klage(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return Promise.resolve(fakeK9KlageResponse.map(innslag => this.#beriker.berikKlageInnslag(innslag, saksnummer)));
  }

  async #hentAlleInnslagK9tilbake(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return Promise.resolve(
      fakeK9TilbakeResponse.map(innslag => this.#beriker.berikTilbakeInnslag(innslag, saksnummer)),
    );
  }

  async hentAlleInnslag(saksnummer: string): Promise<HentetHistorikk> {
    const k9Sak = await fangFeilVedHenting('k9-sak', this.#hentAlleInnslagK9sak(saksnummer));
    const k9Klage = await fangFeilVedHenting('k9-klage', this.#hentAlleInnslagK9klage(saksnummer));
    const k9Tilbake = await fangFeilVedHenting('k9-tilbake', this.#hentAlleInnslagK9tilbake(saksnummer));
    return {
      innslag: [...k9Sak.innslag, ...k9Klage.innslag, ...k9Tilbake.innslag],
      feilet: [...k9Sak.feilet, ...k9Klage.feilet, ...k9Tilbake.feilet],
    };
  }
}
