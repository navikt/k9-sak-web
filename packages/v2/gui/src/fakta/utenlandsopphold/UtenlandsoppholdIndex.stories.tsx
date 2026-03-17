import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UtenlandsoppholdApiContext } from './api/UtenlandsoppholdApiContext.js';
import UtenlandsoppholdIndex from './UtenlandsoppholdIndex.js';
import type { UtenlandsoppholdApi } from './api/UtenlandsoppholdApi.js';

const BEHANDLING_UUID = 'test-uuid';

const mockData: UtenlandsoppholdDto = {
  perioder: [
    { periode: '2026-02-08/2026-02-15', landkode: { kode: 'LUX' }, region: 'EOS', årsak: undefined },
    { periode: '2026-01-31/2026-02-07', landkode: { kode: 'CHN' }, region: 'ANNET', årsak: 'INGEN' },
    {
      periode: '2026-01-24/2026-01-30',
      landkode: { kode: 'MOZ' },
      region: 'ANNET',
      årsak: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_DEKKET_ETTER_AVTALE_MED_ET_ANNET_LAND_OM_TRYGD',
    },
    {
      periode: '2026-01-17/2026-01-23',
      landkode: { kode: 'FIN' },
      region: 'NORDEN',
      årsak: undefined,
    },
    {
      periode: '2026-01-10/2026-01-16',
      landkode: { kode: 'TUR' },
      region: 'ANNET',
      årsak: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING',
    },
    { periode: '2026-01-03/2026-01-09', landkode: { kode: 'CHE' }, region: 'ANNET', årsak: 'INGEN' },
    { periode: '2025-12-27/2026-01-02', landkode: { kode: 'XXK' }, region: 'ANNET', årsak: 'INGEN' },
    { periode: '2025-12-20/2025-12-26', landkode: { kode: 'GBR' }, region: 'EOS', årsak: 'INGEN' },
  ],
};

const tomMockData: UtenlandsoppholdDto = { perioder: [] };

const withFakeApi = (data: UtenlandsoppholdDto): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const api: UtenlandsoppholdApi = {
    getUtenlandsopphold: async () => data,
  };
  return Story => (
    <QueryClientProvider client={queryClient}>
      <UtenlandsoppholdApiContext value={api}>
        <Suspense>
          <Story />
        </Suspense>
      </UtenlandsoppholdApiContext>
    </QueryClientProvider>
  );
};

const meta = {
  title: 'gui/fakta/utenlandsopphold/UtenlandsoppholdIndex',
  component: UtenlandsoppholdIndex,
  decorators: [withFakeApi(mockData), withK9Kodeverkoppslag()],
  args: {
    behandlingUuid: BEHANDLING_UUID,
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  },
} satisfies Meta<typeof UtenlandsoppholdIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pleiepenger: Story = {};

export const Opplæringspenger: Story = {
  args: { fagsakYtelseType: fagsakYtelsesType.OPPLÆRINGSPENGER },
};

export const PleiepengerNærstående: Story = {
  args: { fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE },
};

export const IngenUtenlandsopphold: Story = {
  decorators: [withFakeApi(tomMockData), withK9Kodeverkoppslag()],
};
