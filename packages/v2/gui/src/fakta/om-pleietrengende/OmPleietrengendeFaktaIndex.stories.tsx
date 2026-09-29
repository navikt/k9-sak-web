import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { expect } from 'storybook/test';
import { OmPleietrengendeApiContext } from './api/OmPleietrengendeApiContext.js';
import OmPleietrengendeFaktaIndex from './OmPleietrengendeFaktaIndex.js';

const withFakeApi = (data: PersonopplysningDto | null): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <OmPleietrengendeApiContext value={{ hentPleietrengende: async () => data }}>
        <Suspense>
          <Story />
        </Suspense>
      </OmPleietrengendeApiContext>
    </QueryClientProvider>
  );
};

const pleietrengendeMock: PersonopplysningDto = {
  aktoerId: '1234567890123',
  fnr: '12345678910',
  navn: 'Ola Nordmann',
};

const meta = {
  title: 'gui/fakta/om-pleietrengende/OmPleietrengendeFaktaIndex',
  component: OmPleietrengendeFaktaIndex,
  args: {
    behandlingUuid: 'test-behandling-uuid',
  },
} satisfies Meta<typeof OmPleietrengendeFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withFakeApi(pleietrengendeMock)],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Om pleietrengende' })).toBeInTheDocument();
    await expect(canvas.getByText('Ola Nordmann')).toBeInTheDocument();
    await expect(canvas.getByText('12345678910')).toBeInTheDocument();
  },
};

export const IngenData: Story = {
  decorators: [withFakeApi(null)],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ikke hentet inn data.')).toBeInTheDocument();
  },
};
