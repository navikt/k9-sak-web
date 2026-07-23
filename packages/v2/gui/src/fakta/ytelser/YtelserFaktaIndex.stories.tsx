import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RelatertYtelseResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import { expect } from 'storybook/test';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
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

const ytelserMock: RelatertYtelseResponse[] = [
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

const meta = {
  title: 'gui/fakta/ytelser/YtelserFaktaIndex',
  component: YtelserFaktaIndex,
  decorators: [withKodeverkContext(), withFakeApi(ytelserMock)],
  args: {
    behandlingUuid: 'test-behandling-uuid',
  },
} satisfies Meta<typeof YtelserFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MedDetaljer: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Pleiepenger sykt barn')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Vis detaljer', expanded: false })).toBeVisible();
  },
};

export const IngenYtelser: Story = {
  decorators: [withFakeApi([])],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Søker har ingen relaterte ytelser å vise.')).toBeVisible();
  },
};
