import { withFakeHistorikkBackend } from '@k9-sak-web/gui/storybook/decorators/withFakeHistorikkBackend.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { HistorikkIndex } from './HistorikkIndex.js';

const meta = {
  title: 'gui/sak/historikk/HistorikkIndex',
  component: HistorikkIndex,
  decorators: [
    withMaxWidth(600),
    withKodeverkContext(),
    withFakeHistorikkBackend(),
    withK9Kodeverkoppslag(), // Må vere etter withFakeHistorikkBackend(), sidan den bruker context oppretta i denne.
  ],
} satisfies Meta<typeof HistorikkIndex>;

type Story = StoryObj<typeof meta>;

export const K9Historikk: Story = {
  args: {
    saksnummer: '12345',
    behandlingId: 1,
    behandlingVersjon: 2,
  },
  play: async ({ canvas }) => {
    const boble1El = await canvas.findByTestId(/snakkeboble-2025-08-29T10:41:30.155/);
    await expect(boble1El).toHaveTextContent('Behandling er gjenopptatt');
    await expect(boble1El).toHaveTextContent('Vedtaksløsningen');

    const boble2El = canvas.getByTestId('snakkeboble-2025-05-06T11:16:01.228');
    await expect(boble2El).toHaveTextContent('Saksbehandler');
    await expect(boble2El.querySelector('h4')).toHaveTextContent('Behandling er henlagt');

    const boble3El = canvas.getByTestId('snakkeboble-2025-05-06T11:16:00.607');
    await expect(boble3El.querySelector('a')).toHaveTextContent('Formkrav klage Vedtaksinstans');

    const boble4El = canvas.getByTestId('snakkeboble-2025-02-27T17:40:42.779');
    await expect(boble4El).toHaveTextContent('Vedtaksløsningen');
    await expect(boble4El).toHaveTextContent('Tilbakekreving opprettet');
    // Test at skjermlenke på historikkinnslag har blitt rendra:
    await expect(boble4El.querySelector('a')).toHaveTextContent('Tilbakekreving');

    const boble5El = await canvas.findByTestId('snakkeboble-2026-01-12T11:39:38.694');
    await expect(boble5El).toHaveTextContent('Fakta endret');
    await expect(boble5El.querySelector('a')).toHaveTextContent('Medisinsk');
    await expect(boble5El).toHaveTextContent('Sykdom manuelt behandlet');

    const boble6El = canvas.getByTestId('snakkeboble-2026-01-12T11:38:54.64');
    await expect(boble6El).toHaveTextContent('Inntektsmelding bestilt fra arbeidsgiver');
    const btn = within(boble6El).queryByRole('button');
    if (btn != null) {
      await userEvent.click(btn); // Vis all tekst
    }
    await expect(boble6El).toHaveTextContent(
      'Oppgave til BEDRIFT AS om å sende inntektsmelding for skjæringstidspunkt 2025-12-15',
    );

    // Test at skjermlenke på historikk-linje har blitt rendra:
    const boble7El = canvas.getByTestId('snakkeboble-2025-11-28T10:00:38.993');
    await expect(boble7El).toHaveTextContent('Gjeldende fra');
    await expect(boble7El).toHaveTextContent('27.10.2025');
    {
      const btn = within(boble7El).queryByRole('button');
      if (btn != null) {
        await userEvent.click(btn); // Vis all tekst
      }
    }
    await expect(boble7El).toHaveTextContent('Inntekt fra GENIERKLÆRT STRIDLYNT KATT SKYVEDØR (315227569)');
  },
};

export default meta;
