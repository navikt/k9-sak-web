import HistorikkIndex from './HistorikkIndex.js';
import { Meta, StoryObj } from '@storybook/react';
import { kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi.js';
import { expect, userEvent, within } from '@storybook/test';
import withFeatureToggles from '@k9-sak-web/gui/storybook/decorators/withFeatureToggles.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import type { Historikkinnslag } from '@k9-sak-web/types';
import { setBaseRequestApiMocks } from '../../../../storybook/stories/mocks/setBaseRequestApiMocks.js';
import { historikkSakV1 } from '../../../../storybook/stories/mocks/historikkSakV1.js';
import { historikkTilbakeV2 } from '../../../../storybook/stories/mocks/historikkTilbakeV2.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import { withFakeHistorikkBackend } from '@k9-sak-web/gui/storybook/decorators/withFakeHistorikkBackend.js';

const historyK9KlageV1: Historikkinnslag[] = [
  {
    uuid: '0e722618-9b62-4935-a261-c7895ead7d9f',
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 999952,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: {
          kode: 'HENLAGT_FEILOPPRETTET',
          kodeverk: 'BEHANDLING_RESULTAT_TYPE',
        },
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseFritekst: 'Henlegger fra verdikjedetest',
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'AVBRUTT_BEH',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'S123456',
    opprettetTidspunkt: '2025-05-06T11:16:01.228',
    type: {
      kode: 'AVBRUTT_BEH',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
  },
  {
    uuid: 'd2d54535-8f0c-424e-8dfd-621a750bdb4c',
    aktoer: {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 999952,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseFritekst: 'autotest',
        endredeFelter: [
          {
            endretFeltNavn: {
              kode: 'PA_KLAGD_BEHANDLINGID',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            fraVerdi: undefined,
            klFraVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            klTilVerdi: undefined,
            navnVerdi: undefined,
            tilVerdi: 'Førstegangsbehandling 06.05.2025',
          },
          {
            endretFeltNavn: {
              kode: 'ER_KLAGER_PART',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            fraVerdi: undefined,
            klFraVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            klTilVerdi: undefined,
            navnVerdi: undefined,
            tilVerdi: true,
          },
          {
            endretFeltNavn: {
              kode: 'ER_KLAGEFRIST_OVERHOLDT',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            fraVerdi: undefined,
            klFraVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            klTilVerdi: undefined,
            navnVerdi: undefined,
            tilVerdi: true,
          },
          {
            endretFeltNavn: {
              kode: 'ER_KLAGEN_SIGNERT',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            fraVerdi: undefined,
            klFraVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            klTilVerdi: undefined,
            navnVerdi: undefined,
            tilVerdi: true,
          },
          {
            endretFeltNavn: {
              kode: 'ER_KLAGE_KONKRET',
              kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
            },
            fraVerdi: undefined,
            klFraVerdi: undefined,
            klNavn: 'HISTORIKK_ENDRET_FELT_TYPE',
            klTilVerdi: undefined,
            navnVerdi: undefined,
            tilVerdi: true,
          },
        ],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'KLAGE_BEH_NFP',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: {
          kodeverk: 'SKJERMLENKE_TYPE',
          kode: 'FORMKRAV_KLAGE_NFP',
        },
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'S123456',
    opprettetTidspunkt: '2025-05-06T11:16:00.607',
    type: {
      kode: 'KLAGE_BEH_NFP',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
  },
  {
    uuid: 'b62d9bb8-8f1b-446d-8861-67a593c0507c',
    aktoer: {
      kode: 'SOKER',
      kodeverk: 'HISTORIKK_AKTOER',
    },
    behandlingId: 999952,
    dokumentLinks: [],
    historikkinnslagDeler: [
      {
        aarsak: undefined,
        aksjonspunkter: undefined,
        begrunnelse: undefined,
        begrunnelseFritekst: undefined,
        endredeFelter: [],
        gjeldendeFra: undefined,
        hendelse: {
          navn: {
            kode: 'KLAGEBEH_STARTET',
            kodeverk: 'HISTORIKKINNSLAG_TYPE',
          },
          verdi: undefined,
        },
        opplysninger: [],
        resultat: undefined,
        skjermlenke: undefined,
        soeknadsperiode: undefined,
        tema: undefined,
      },
    ],
    opprettetAv: 'S123456',
    opprettetTidspunkt: '2025-05-06T11:15:54.829',
    type: {
      kode: 'BEH_STARTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
  },
];

const meta = {
  title: 'sak/sak-app/behandlingsupport/historikk/HistorikkIndex',
  component: HistorikkIndex,
  decorators: [
    withMaxWidth(600),
    withKodeverkContext(),
    withFeatureToggles({ HISTORIKK_V2_VIS: true }),
    withFakeHistorikkBackend(),
    withK9Kodeverkoppslag(), // Må vere etter withFakeHistorikkBackend(), sidan den bruker context oppretta i denne.
  ],
  beforeEach: () => {
    requestApi.clearAllMockData();
    setBaseRequestApiMocks(requestApi);
    requestApi.mock(K9sakApiKeys.HISTORY_K9SAK, historikkSakV1);
    requestApi.mock(K9sakApiKeys.HISTORY_TILBAKE_V2, historikkTilbakeV2);
    requestApi.mock(K9sakApiKeys.HISTORY_KLAGE, historyK9KlageV1);
  },
} satisfies Meta<typeof HistorikkIndex>;

type Story = StoryObj<typeof meta>;

export const HistorikkinnslagV1: Story = {
  args: {
    saksnummer: '12345',
    behandlingId: 1,
    behandlingVersjon: 2,
    kjønn: kjønn.MANN,
  },
  decorators: [withFeatureToggles({ HISTORIKK_V2_VIS: false })],
  play: async ({ canvas }) => {
    const boble1El = (await canvas.findByText(/23.01.2025 - 14:47/)).parentElement?.parentElement;
    await expect(boble1El).toHaveTextContent('Vedtak fattet');
    await expect(boble1El).toHaveTextContent('Beslutter');

    const boble2El = canvas.getByText(/23.01.2025 - 14:45/).parentElement?.parentElement;
    await expect(boble2El).toHaveTextContent(/Vedtak foreslått og sendt til beslutter:\s?(?:Full)? Tilbakebetaling/i);
    await expect(boble2El).toHaveTextContent('Saksbehandler');

    const boble3El = canvas.getByText(/23.01.2025 - 14:04/).parentElement?.parentElement;
    await expect(boble3El).toHaveTextContent('Saksbehandler');
    await expect(boble3El).toHaveTextContent('Vurdering av perioden 07.10.2024-20.10.2024.');
    await expect(boble3El).toHaveTextContent('test');
    await expect(boble3El).toHaveTextContent(
      'Er vilkårene for tilbakekreving oppfylt? er satt til Ja, mottaker forsto eller burde forstått at utbetalingen skyldtes en feil (1. ledd, 1. punkt).',
    );
    await expect(boble3El).toHaveTextContent(
      'I hvilken grad har mottaker handlet uaktsomhet? er satt til Simpel uaktsomhet.',
    );
    await expect(boble3El).toHaveTextContent(
      'Er det særlige grunner til reduksjon? er satt til Nei: Graden av uaktsomhet hos den kravet retter seg mot.',
    );

    const boble4El = canvas.getByTestId('snakkeboble-2025-01-20T07:08:06.623');
    await expect(boble4El).toHaveTextContent('Vedtaksløsningen');
    await expect(boble4El).toHaveTextContent('Tilbakekreving opprettet');

    const boble5El = await canvas.findByTestId('snakkeboble-2025-01-20T07:07:51.914');
    await expect(boble5El).toHaveTextContent('Simulering');
    await expect(boble5El).toHaveTextContent('Fastsett videre behandling er satt til Opprett tilbakekreving');
    await expect(boble5El).toHaveTextContent('test');

    const boble6El = canvas.getByTestId('snakkeboble-2025-01-16T06:44:26.799');
    await expect(boble6El).toHaveTextContent('Inntektsmelding bestilt fra arbeidsgiver');
    const btn = within(boble6El).queryByRole('button');
    if (btn != null) {
      await userEvent.click(btn); // Vis all tekst
    }
    await expect(boble6El).toHaveTextContent(
      'Oppgave til INTERESSANT INTUITIV KATT DIAMETER om å sende inntektsmelding for skjæringstidspunkt 2024-10-01',
    );
  },
};

export const HistorikkinnslagV2: Story = {
  args: HistorikkinnslagV1.args,
  play: async params => {
    await HistorikkinnslagV1.play?.(params);
    // Sjekk at ingenting har feila slik at visning har bytta til v1
    const nyVisningCheck = await params.canvas.findByTestId('NyVisningSwitch');
    await expect(nyVisningCheck).toBeChecked();
  },
};

export default meta;
