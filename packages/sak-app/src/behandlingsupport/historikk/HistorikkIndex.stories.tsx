import { kjønn } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import { withFakeHistorikkBackend } from '@k9-sak-web/gui/storybook/decorators/withFakeHistorikkBackend.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { setBaseRequestApiMocks } from '../../../../storybook/stories/mocks/setBaseRequestApiMocks.js';
import { requestApi } from '../../data/k9sakApi.js';
import HistorikkIndex from './HistorikkIndex.js';

const meta = {
  title: 'sak/sak-app/behandlingsupport/historikk/HistorikkIndex',
  component: HistorikkIndex,
  decorators: [
    withMaxWidth(600),
    withKodeverkContext(),
    withFakeHistorikkBackend(),
    withK9Kodeverkoppslag(), // Må vere etter withFakeHistorikkBackend(), sidan den bruker context oppretta i denne.
  ],
  beforeEach: () => {
    requestApi.clearAllMockData();
    setBaseRequestApiMocks(requestApi);
  },
} satisfies Meta<typeof HistorikkIndex>;

type Story = StoryObj<typeof meta>;

export const HistorikkinnslagV2: Story = {
  args: {
    saksnummer: '12345',
    behandlingId: 1,
    behandlingVersjon: 2,
    kjønn: kjønn.MANN,
  },
  play: async ({ canvas }) => {
    const boble1El = await canvas.findByTestId(/snakkeboble-2025-08-29T10:41:30.155/);
    await expect(boble1El).toHaveTextContent('Behandling er gjenopptatt');
    await expect(boble1El).toHaveTextContent('Vedtaksløsningen');

    const boble2El = canvas.getByTestId('snakkeboble-2025-05-06T11:16:01.228');
    await expect(boble2El).toHaveTextContent('Saksbehandler');
    await expect(boble2El.querySelector('h1')).toHaveTextContent('Behandling er henlagt');

    const boble3El = canvas.getByTestId('snakkeboble-2025-05-06T11:16:00.607');
    await expect(boble3El.querySelector('a')).toHaveTextContent('Formkrav klage Vedtaksinstans');

    const boble4El = canvas.getByTestId('snakkeboble-2025-02-27T17:40:42.779');
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

export default meta;
