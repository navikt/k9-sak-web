import { FC } from 'react';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import HistorikkSakIndex from './HistorikkSakIndex';
import defaultHistorikk from './mock/defaultHistorikk';
import overlappendeSakHistorikk from './mock/OverlappendeSak';
import { Meta, StoryObj } from '@storybook/react';
import { Historikkinnslag } from '@k9-sak-web/types';
import behandlingStartet, { innsynOpprettet, nyeRegisteropplysninger, overlappendeSak } from './mock/historikkinnslag';
import { userEvent, within, expect, fireEvent, fn } from '@storybook/test';

const locationMock = {
  key: '1',
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
};

const saksnummer = '1';
const getBehandlingLocation = () => locationMock;
const createLocationForSkjermlenke = () => locationMock;
const erTilbakekreving = false;

const defaultArgs = {
  saksnummer,
  getBehandlingLocation,
  alleKodeverk: alleKodeverk as any,
  createLocationForSkjermlenke,
  erTilbakekreving,
};

const meta = {
  title: 'sak/sak-historikk/Historikkinnslag',
  component: HistorikkSakIndex,
  argTypes: { alleKodeverk: { control: false } },
} satisfies Meta<typeof HistorikkSakIndex>;

type Story = StoryObj<typeof meta>;

export const BehandlingStartet: Story = {
  args: { ...defaultArgs, historikkinnslag: behandlingStartet },
  play: async ({ canvas, step }) => {
    await step('Skal vise historikkinnslag for behandling startet', async () => {
      await expect(canvas.getByText('Behandling startet')).toBeInTheDocument();
      await expect(canvas.getByRole('link', { name: 'DokumentSøknad' }));
      await expect(canvas.getByRole('link').getAttribute('href')).toContain(
        'hent-dokument?saksnummer=1&journalpostId=2&dokumentId=3',
      );
    });
  },
};

export const InnsynOpprettet: Story = {
  args: { ...defaultArgs, historikkinnslag: innsynOpprettet },
  play: async ({ canvas, step }) => {
    await step('Skal vise historikkinnslag for innsyn opprettet', async () => {
      await expect(canvas.getByText('Innsynsbehandling opprettet'));
      await expect(canvas.getByRole('heading', { name: 'Saksbehandler S123456 18.09.2019 - 15:25' }));
      await expect(
        canvas.getByRole('paragraph', {
          name: (_, element) => element.textContent === 'Krav om innsyn mottatt 18.09.2019',
        }),
      );
    });
  },
};

export const NyeRegisteropplysninger: Story = {
  args: { ...defaultArgs, historikkinnslag: nyeRegisteropplysninger },
  play: async ({ canvas, step }) => {
    await step('Skal vise historikkinnslag for nye registeropplysninger', async () => {
      await expect(canvas.getByRole('heading', { name: 'Vedtaksløsningen 19.09.2019 - 12:16' }));
      await expect(canvas.getByText('Nye registeropplysninger'));
    });
  },
};

export const OverlappendeSak: Story = {
  args: { ...defaultArgs, historikkinnslag: overlappendeSak },
  play: async ({ canvas, step }) => {
    await step('Skal vise historikkinnslag for innsyn opprettet', async () => {
      await expect(canvas.getByText('Manuelt fastsatt uttaksgrad'));
      await expect(canvas.getByRole('heading', { name: 'Saksbehandler S123456 16.01.2025 - 09:27' }));
      await expect(
        canvas.getByRole('paragraph', {
          name: (_, element) => element.textContent === 'Det må da være lov å ha litt overlappende uttak.',
        }),
      );
    });
  },
};

export default meta;
