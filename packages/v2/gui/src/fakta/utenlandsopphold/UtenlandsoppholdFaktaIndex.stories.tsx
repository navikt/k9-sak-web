import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { expect, userEvent, within } from 'storybook/test';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import { Region } from '@k9-sak-web/backend/k9sak/kodeverk/geografisk/Region.js';
import { UtenlandsoppholdÅrsak } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/UtenlandsoppholdÅrsak.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import { UtenlandsoppholdApiContext } from './api/UtenlandsoppholdApiContext.js';
import UtenlandsoppholdFaktaIndex from './UtenlandsoppholdFaktaIndex.js';

const withFakeApi = (data: UtenlandsoppholdDto): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <UtenlandsoppholdApiContext value={{ hentUtenlandsopphold: async () => data }}>
        <Suspense>
          <Story />
        </Suspense>
      </UtenlandsoppholdApiContext>
    </QueryClientProvider>
  );
};

const utenlandsoppholdMock: UtenlandsoppholdDto = {
  perioder: [
    {
      periode: `${dayjs().subtract(7, 'day').format('YYYY-MM-DD')}/${dayjs().format('YYYY-MM-DD')}`,
      landkode: { kode: 'LUX' },
      region: Region.EOS,
    },
    {
      periode: `${dayjs().subtract(15, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(8, 'day').format('YYYY-MM-DD')}`,
      landkode: { kode: 'CHN' },
      region: Region.TREDJELANDS_BORGER,
      årsak: UtenlandsoppholdÅrsak.INGEN,
    },
    {
      periode: `${dayjs().subtract(22, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(16, 'day').format('YYYY-MM-DD')}`,
      landkode: { kode: 'MOZ' },
      region: Region.TREDJELANDS_BORGER,
      årsak: UtenlandsoppholdÅrsak.BARNET_INNLAGT_I_HELSEINSTITUSJON_DEKKET_ETTER_AVTALE_MED_ET_ANNET_LAND_OM_TRYGD,
    },
    {
      periode: `${dayjs().subtract(30, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(23, 'day').format('YYYY-MM-DD')}`,
      landkode: { kode: 'FIN' },
      region: Region.NORDEN,
    },
    {
      periode: `${dayjs().subtract(38, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(31, 'day').format('YYYY-MM-DD')}`,
      landkode: { kode: 'TUR' },
      region: Region.TREDJELANDS_BORGER,
      årsak: UtenlandsoppholdÅrsak.BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING,
    },
    {
      periode: `${dayjs().subtract(45, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(39, 'day').format('YYYY-MM-DD')}`,
      landkode: { kode: 'CHE' },
      region: Region.TREDJELANDS_BORGER,
      årsak: UtenlandsoppholdÅrsak.INGEN,
    },
    {
      periode: `${dayjs().subtract(52, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(47, 'day').format('YYYY-MM-DD')}`,
      landkode: { kode: 'XXK' },
      region: Region.TREDJELANDS_BORGER,
      årsak: UtenlandsoppholdÅrsak.INGEN,
    },
    {
      periode: `${dayjs().subtract(59, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(55, 'day').format('YYYY-MM-DD')}`,
      landkode: { kode: 'GBR' },
      region: Region.EOS,
      årsak: UtenlandsoppholdÅrsak.INGEN,
    },
  ],
};

const perioder = utenlandsoppholdMock.perioder!;

const meta = {
  title: 'gui/fakta/utenlandsopphold/UtenlandsoppholdFaktaIndex',
  component: UtenlandsoppholdFaktaIndex,
  decorators: [withK9Kodeverkoppslag(), withFakeApi(utenlandsoppholdMock)],
  args: {
    behandlingUuid: 'test-behandling-uuid',
  },
} satisfies Meta<typeof UtenlandsoppholdFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  },
};

export const HjelpetekstKanToggle: Story = {
  args: {
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Hjelpetekst er lukket som standard', async () => {
      await expect(
        canvas.getByRole('button', {
          name: 'Hvor lenge har søker rett på pleiepenger i utlandet?',
          expanded: false,
        }),
      ).toBeInTheDocument();
    });
    await step('Hjelpetekst åpnes ved klikk', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Hvor lenge har søker rett på pleiepenger i utlandet?' }),
      );
      await expect(
        canvas.getByRole('button', {
          name: 'Hvor lenge har søker rett på pleiepenger i utlandet?',
          expanded: true,
        }),
      ).toBeInTheDocument();
    });
  },
};

export const OmsorgspengerYtelsestype: Story = {
  args: {
    fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', {
        name: 'Hvor lenge har søker rett på omsorgspenger i utlandet?',
        expanded: false,
      }),
    ).toBeInTheDocument();
  },
};

export const EØSLandVises: Story = {
  decorators: [withFakeApi({ perioder: [perioder[0]!] })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Land')).toBeVisible();
    await expect(canvas.getByText('Luxemburg')).toBeVisible();
    await expect(canvas.getByText('EØS')).toBeVisible();
    await expect(canvas.getByText('Ja')).toBeVisible();
    await expect(canvas.getByText('Merknad til utenlandsopphold')).toBeVisible();
    await expect(canvas.getByText('Periode telles ikke.')).toBeVisible();
  },
};

export const LandUtenforEØSVises: Story = {
  decorators: [withFakeApi({ perioder: [perioder[1]!] })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Land')).toBeVisible();
    await expect(canvas.getByText('Kina')).toBeVisible();
    await expect(canvas.getByText('EØS')).toBeVisible();
    await expect(canvas.getByText('Nei')).toBeVisible();
    await expect(
      canvas.getByText('Ingen årsak til utenlandsoppholdet er oppgitt, perioden telles i 8 uker'),
    ).toBeVisible();
  },
};

export const KosovoVises: Story = {
  decorators: [withFakeApi({ perioder: [perioder[6]!] })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Kosovo')).toBeVisible();
    await expect(canvas.getByText('Nei')).toBeVisible();
  },
};

export const StorbritanniaErIkkeEØS: Story = {
  decorators: [withFakeApi({ perioder: [perioder[7]!] })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Storbritannia')).toBeVisible();
    await expect(canvas.getByText('Nei')).toBeVisible();
  },
};

export const IngenUtenlandsopphold: Story = {
  decorators: [withFakeApi({ perioder: [] })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Søker har ingen utenlandsopphold å vise.')).toBeVisible();
  },
};
