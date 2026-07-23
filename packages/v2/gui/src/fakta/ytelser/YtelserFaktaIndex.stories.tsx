import type { RelatertYtelseResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { YtelserApiContext } from './api/YtelserApiContext.js';
import YtelserFaktaIndex from './YtelserFaktaIndex.js';

const withFakeApi = (data: RelatertYtelseResponse[]): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return Story => (
    <QueryClientProvider client={queryClient}>
      <YtelserApiContext value={{ hentYtelser: async () => data }}>
        <Suspense>
          <Story />
        </Suspense>
      </YtelserApiContext>
    </QueryClientProvider>
  );
};

const ytelserFlereTyper: RelatertYtelseResponse[] = [
  {
    ytelseType: 'PSB',
    data: [
      {
        fom: '2026-01-01',
        tom: '2026-01-31',
        status: 'LØPENDE',
        relatertSaksnummer: 'ABC123',
      },
      {
        fom: '2026-03-01',
        tom: '2026-03-31',
        status: 'AVSLUTTET',
        relatertSaksnummer: 'ABC124',
      },
    ],
  },
  {
    ytelseType: 'OMP',
    data: [
      {
        fom: '2026-02-10',
        tom: '2026-02-20',
        status: 'ÅPEN',
        relatertSaksnummer: 'XYZ999',
      },
    ],
  },
];

const ytelserFlerePerioder: RelatertYtelseResponse[] = [
  {
    ytelseType: 'PSB',
    data: [
      { fom: '2025-01-01', tom: '2025-03-31', status: 'AVSLUTTET', relatertSaksnummer: 'PSB001' },
      { fom: '2025-06-01', tom: '2025-08-31', status: 'AVSLUTTET', relatertSaksnummer: 'PSB002' },
      { fom: '2025-10-01', tom: '2025-12-31', status: 'AVSLUTTET', relatertSaksnummer: 'PSB003' },
      { fom: '2026-01-01', tom: '2026-06-30', status: 'LØPENDE', relatertSaksnummer: 'PSB004' },
    ],
  },
];

const meta = {
  title: 'gui/fakta/ytelser/YtelserFaktaIndex',
  component: YtelserFaktaIndex,
  decorators: [withK9Kodeverkoppslag(), withFakeApi(ytelserFlereTyper)],
  args: {
    behandlingUuid: 'test-behandling-uuid',
  },
} satisfies Meta<typeof YtelserFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MedDetaljer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const knapp = await canvas.findByRole('button', { name: 'Vis detaljer' });
    await expect(knapp).toBeVisible();
    await userEvent.click(knapp);
    await expect(await canvas.findByRole('table')).toBeVisible();
  },
};

export const FlereYtelseTyper: Story = {};

export const FlerePerioder: Story = {
  decorators: [withFakeApi(ytelserFlerePerioder)],
};

export const IngenYtelser: Story = {
  decorators: [withFakeApi([])],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Søker har ingen relaterte ytelser å vise.')).toBeVisible();
  },
};
