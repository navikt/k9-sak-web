import type { HentAlleInnslagV2Response } from '@k9-sak-web/backend/k9sak/generated';
import type { HistorikkBackendApi } from '../../sak/historikk/HistorikkBackendApi.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';
import {
  type KlageHistorikkInnslagV2,
  type SakHistorikkInnslagV2,
} from '../../sak/historikk/historikkTypeBerikning.js';
import { HistorikkInnslagTypeBeriker } from '../../sak/historikk/historikkTypeBerikning.js';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.js';
import type { HistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9klage/generated/types.js';

// Kopi av respons frå k9-sak backend i dev
const fakeK9SakResponse: HentAlleInnslagV2Response = [
  {
    behandlingId: 1005501,
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-01-20T07:07:59.106',
    dokumenter: [],
    tittel: 'Vedtak fattet: Innvilget',
    linjer: [
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'VEDTAK',
      },
    ],
    uuid: 'ab6b49a9-84a3-40e6-a038-ac51f1a1304d',
  },
  {
    behandlingId: 1005501,
    aktør: {
      type: 'SBH',
      ident: 'Z990404',
    },
    opprettetTidspunkt: '2025-01-20T07:07:51.914',
    dokumenter: [],
    tittel: 'Metode for å håndtere tilbakekreving av feilutbetailng er valgt.',
    linjer: [
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'FAKTA_OM_SIMULERING',
      },
      {
        type: 'TEKST',
        tekst: '__Fastsett videre behandling__ er satt til __Opprett tilbakekreving__.',
      },
      {
        type: 'TEKST',
        tekst: 'test',
      },
    ],
    uuid: '0b1fecdc-3270-469c-9507-493adc66f0f7',
  },
  {
    aktør: {
      type: 'SOKER',
    },
    opprettetTidspunkt: '2025-01-20T07:06:58.758',
    dokumenter: [
      {
        tag: 'Søknad',
        utgått: false,
        journalpostId: '453925540',
        dokumentId: '454327391',
      },
    ],
    tittel: 'Vedlegg mottatt',
    linjer: [],
    uuid: '30461cb8-d6ac-40b5-ab21-1d685df90d84',
  },
  {
    behandlingId: 1005501,
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-01-20T07:06:56.979',
    dokumenter: [],
    tittel: 'Revurdering opprettet',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Endring fra bruker',
      },
    ],
    uuid: 'f4554e3a-1964-48f5-8b00-615ce840cf0c',
  },
  {
    behandlingId: 1004852,
    aktør: {
      type: 'BESL',
      ident: 'Z990422',
    },
    opprettetTidspunkt: '2025-01-16T07:07:34.406',
    dokumenter: [],
    tittel: 'Vedtak fattet: Innvilget',
    linjer: [
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'VEDTAK',
      },
    ],
    uuid: 'd577e8e5-6d55-4063-9793-d87e3bf065da',
  },
  {
    behandlingId: 1004852,
    aktør: {
      type: 'SBH',
      ident: 'Z990404',
    },
    opprettetTidspunkt: '2025-01-16T07:06:30.17',
    dokumenter: [],
    tittel: 'Vedtak foreslått og sendt til beslutter: Innvilget',
    linjer: [
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'VEDTAK',
      },
    ],
    uuid: '8de187c9-ffc2-43fa-b792-243f2eaab577',
  },
  {
    behandlingId: 1004852,
    aktør: {
      type: 'SBH',
      ident: 'Z990404',
    },
    opprettetTidspunkt: '2025-01-16T07:05:25.69',
    dokumenter: [],
    tittel: 'Fakta endret',
    linjer: [
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'PUNKT_FOR_MEDISINSK',
      },
      {
        type: 'TEKST',
        tekst: 'Sykdom manuelt behandlet.',
      },
    ],
    uuid: '462e4b96-f495-4c67-9054-ea787d703f65',
  },
  {
    behandlingId: 1004852,
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-01-16T06:59:31.487',
    dokumenter: [],
    tittel: 'Behandling gjenopptatt',
    linjer: [],
    uuid: 'ec046eaf-1db4-4a92-9dfe-900cb6b4a06e',
  },
  {
    aktør: {
      type: 'ARBEIDSGIVER',
    },
    opprettetTidspunkt: '2025-01-16T06:59:30.613',
    dokumenter: [
      {
        tag: 'Inntektsmelding',
        utgått: false,
        journalpostId: '453920793',
        dokumentId: '454322584',
      },
    ],
    tittel: 'Vedlegg mottatt',
    linjer: [],
    uuid: '745400e4-5977-49cf-aedd-b72ecec76412',
  },
  {
    behandlingId: 1004852,
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-01-16T06:44:26.799',
    dokumenter: [],
    tittel: 'Inntektsmelding bestilt fra arbeidsgiver',
    linjer: [
      {
        type: 'TEKST',
        tekst:
          'Oppgave til INTERESSANT INTUITIV KATT DIAMETER om å sende inntektsmelding for skjæringstidspunkt 2024-10-01',
      },
    ],
    uuid: 'ae560057-a553-43c7-bd99-7edf728bae94',
  },
  {
    behandlingId: 1004852,
    aktør: {
      type: 'VL',
    },
    opprettetTidspunkt: '2025-01-16T06:44:25.917',
    dokumenter: [],
    tittel: 'Behandling på vent: 23.01.2025',
    linjer: [
      {
        type: 'TEKST',
        tekst: 'Venter på inntektsmeldinger etter etterlysning',
      },
    ],
    uuid: '0db31cb1-a00f-470a-bda3-313e6613762f',
  },
  {
    aktør: {
      type: 'SOKER',
    },
    opprettetTidspunkt: '2025-01-16T06:44:06.316',
    dokumenter: [
      {
        tag: 'Søknad',
        utgått: false,
        journalpostId: '453920792',
        dokumentId: '454322582',
      },
      {
        tag: 'Vedlegg',
        utgått: false,
        journalpostId: '453920792',
        dokumentId: '454322583',
      },
    ],
    tittel: 'Vedlegg mottatt',
    linjer: [],
    uuid: '92bfbbef-9c71-483c-885b-a5b393679b53',
  },
  {
    behandlingId: 1000301,
    aktør: {
      type: 'BESL',
      ident: 'Z990422',
    },
    opprettetTidspunkt: '2024-12-02T07:46:22.373',
    dokumenter: [],
    tittel: 'Sak retur',
    linjer: [
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'FAKTA_OM_MEDISINSK',
        tekst: ': __Godkjent__',
      },
      {
        type: 'TEKST',
        tekst: '(Aksjonspunkt: Kontroller legeerklæring)',
      },
      {
        type: 'TEKST',
        tekst: 'Kommentar: test',
      },
      {
        type: 'LINJESKIFT',
      },
      {
        type: 'SKJERMLENKE',
        skjermlenkeType: 'VEDTAK',
        tekst: ': __Må vurderes på nytt__',
      },
      {
        type: 'TEKST',
        tekst: '(Aksjonspunkt: Fritekstbrev)',
      },
      {
        type: 'TEKST',
        tekst: 'Kommentar: Vedtaksbrev må vurderes igjen',
      },
    ],
    uuid: '52ae8488-6376-4c50-949c-f03abc9676f8',
  },
];

const fakeK9KlageResponse: HistorikkinnslagDtoV2[] = [
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

export class FakeHistorikkBackend implements HistorikkBackendApi {
  #beriker: HistorikkInnslagTypeBeriker;
  constructor(kodeverkoppslag: K9Kodeverkoppslag) {
    this.#beriker = new HistorikkInnslagTypeBeriker(kodeverkoppslag);
  }

  async hentAlleInnslagK9sak(saksnummer: string): Promise<SakHistorikkInnslagV2[]> {
    ignoreUnusedDeclared(saksnummer);
    return Promise.resolve(fakeK9SakResponse.map(innslag => this.#beriker.sakHistorikkInnslagV2(innslag)));
  }

  async hentAlleInnslagK9klage(saksnummer: string): Promise<KlageHistorikkInnslagV2[]> {
    ignoreUnusedDeclared(saksnummer);
    return Promise.resolve(fakeK9KlageResponse.map(innslag => this.#beriker.klageHistorikkInnslagV2(innslag)));
  }
}
