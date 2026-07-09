import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { fn } from 'storybook/test';
import type { FeilutbetalingFaktaApi } from './api/FeilutbetalingFaktaApi.js';
import { FeilutbetalingFaktaApiContext } from './api/FeilutbetalingFaktaApiContext.js';
import FeilutbetalingFaktaIndex from './FeilutbetalingFaktaIndex.js';

const fakta: BehandlingFeilutbetalingFaktaDto = {
  behandlingFakta: {
    totalPeriodeFom: '2024-01-01',
    totalPeriodeTom: '2024-03-31',
    aktuellFeilUtbetaltBeløp: 15000,
    tidligereVarseltBeløp: 12000,
    begrunnelse: undefined,
    datoForRevurderingsvedtak: '2024-04-15',
    perioder: [
      { fom: '2024-01-01', tom: '2024-01-31', belop: 5000 },
      { fom: '2024-02-01', tom: '2024-02-29', belop: 5000 },
      { fom: '2024-03-01', tom: '2024-03-31', belop: 5000 },
    ],
    tilbakekrevingValg: {
      videreBehandling: 'TILBAKEKR_OPPRETT' as const,
    },
  },
};

const faktaMedÅrsaker: BehandlingFeilutbetalingFaktaDto = {
  behandlingFakta: {
    ...fakta.behandlingFakta!,
    begrunnelse: 'Feil i beregningen førte til for mye utbetalt.',
    perioder: [
      {
        fom: '2024-01-01',
        tom: '2024-01-31',
        belop: 5000,
        feilutbetalingÅrsakDto: {
          hendelseType: 'BEREGNING_TYPE' as const,
          hendelseUndertype: 'ENDRING_GRUNNLAG' as const,
        },
      },
      {
        fom: '2024-02-01',
        tom: '2024-02-29',
        belop: 5000,
        feilutbetalingÅrsakDto: {
          hendelseType: 'BEREGNING_TYPE' as const,
          hendelseUndertype: 'ENDRING_GRUNNLAG' as const,
        },
      },
    ],
  },
};

const årsaker: HendelseTyperPrYtelseTypeDto[] = [
  {
    ytelseType: 'PSB' as const,
    hendelseTyper: [
      {
        hendelseType: 'BEREGNING_TYPE' as const,
        hendelseUndertyper: ['ENDRING_GRUNNLAG' as const, 'ENDRET_DEKNINGSGRAD' as const],
      },
      {
        hendelseType: 'MEDLEMSKAP' as const,
        hendelseUndertyper: [],
      },
      {
        hendelseType: 'OKONOMI_FEIL' as const,
        hendelseUndertyper: ['OKONOMI_DOBBELUTBETALING' as const],
      },
    ],
  },
];

const createFakeApi = (
  faktaData: BehandlingFeilutbetalingFaktaDto,
  årsakerData: HendelseTyperPrYtelseTypeDto[],
): FeilutbetalingFaktaApi => ({
  hentFeilutbetalingFakta: async () => faktaData,
  hentFeilutbetalingÅrsaker: async () => årsakerData,
  bekreftAksjonspunkt: async () => {},
});

const withFakeApi = (
  faktaData: BehandlingFeilutbetalingFaktaDto,
  årsakerData: HendelseTyperPrYtelseTypeDto[],
): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <FeilutbetalingFaktaApiContext value={createFakeApi(faktaData, årsakerData)}>
        <Suspense>
          <Story />
        </Suspense>
      </FeilutbetalingFaktaApiContext>
    </QueryClientProvider>
  );
};

const meta = {
  title: 'gui/fakta/feilutbetaling/FeilutbetalingFaktaIndex',
  component: FeilutbetalingFaktaIndex,
  args: {
    behandlingUuid: 'test-uuid',
    fagsakYtelseType: 'PSB',
    readOnly: false,
    hasOpenAksjonspunkter: true,
    submitCallback: fn(),
    behandlingsresultat: { type: 'FULL_TILBAKEBETALING' },
    behandlingÅrsaker: [{ behandlingArsakType: 'RE_FEILUTBETALT_BELØP_REDUSERT' }],
    datoForRevurderingsvedtak: '2024-04-15',
    tilbakekrevingValg: { videreBehandling: 'TILBAKEKR_OPPRETT' },
  },
} satisfies Meta<typeof FeilutbetalingFaktaIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withK9Kodeverkoppslag(), withFakeApi(fakta, årsaker)],
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    hasOpenAksjonspunkter: false,
  },
  decorators: [withK9Kodeverkoppslag(), withFakeApi(faktaMedÅrsaker, årsaker)],
};

export const MedEksisterendeÅrsaker: Story = {
  decorators: [withK9Kodeverkoppslag(), withFakeApi(faktaMedÅrsaker, årsaker)],
};
