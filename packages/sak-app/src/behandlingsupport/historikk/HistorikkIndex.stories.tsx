import HistorikkIndex from './HistorikkIndex.js';
import { Meta, StoryObj } from '@storybook/react';
import { kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi.js';
import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor.js';
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
import { delay } from '@k9-sak-web/gui/utils/delay.js';

const historyK9KlageV1: Historikkinnslag[] = [
  {
    opprettetTidspunkt: '2020-11-16',
    historikkinnslagDeler: [{ skjermlenke: { kode: 'FAKTA_OM_UTTAK', kodeverk: 'SKJERMLENKE_TYPE' } }],
    type: {
      kode: 'FORSLAG_VEDTAK',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
    },
    aktoer: { kode: HistorikkAktor.SAKSBEHANDLER, kodeverk: 'HISTORIKK_AKTOER' },
  },
];

const meta = {
  title: 'sak/sak-app/behandlingsupport/historikk/HistorikkIndex',
  component: HistorikkIndex,
  decorators: [
    withMaxWidth(600),
    withKodeverkContext(),
    withFeatureToggles({ HISTORIKK_V2_VIS: true }),
    withK9Kodeverkoppslag(),
    withFakeHistorikkBackend(),
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

    const boble5El = canvas.getByTestId('snakkeboble-2025-01-20T07:07:51.914');
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
    await delay(1_400); // Vent til samanlikningssjekk har køyrt
    // Sjekk at ingenting har feila slik at visning har bytta til v1
    const nyVisningCheck = await params.canvas.findByTestId('NyVisningSwitch');
    await expect(nyVisningCheck).toBeChecked();
  },
};

export default meta;
