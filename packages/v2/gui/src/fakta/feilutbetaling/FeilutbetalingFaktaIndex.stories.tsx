import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { expect, fn } from 'storybook/test';
import type { FeilutbetalingFaktaApi } from './api/FeilutbetalingFaktaApi.js';
import { FeilutbetalingFaktaApiContext } from './api/FeilutbetalingFaktaApiContext.js';
import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './api/FeilutbetalingFaktaViewModel.js';
import FeilutbetalingFaktaIndex from './FeilutbetalingFaktaIndex.js';
import { FeilutbetalingKodeverkoppslagContext } from './FeilutbetalingKodeverkoppslagContext.js';

const fakta: FeilutbetalingFaktaViewModel = {
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

const faktaMedÅrsaker: FeilutbetalingFaktaViewModel = {
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

const faktaUtenPerioder: FeilutbetalingFaktaViewModel = {
  behandlingFakta: {
    ...fakta.behandlingFakta!,
    perioder: [],
  },
};

const årsaker: FeilutbetalingÅrsakerPerYtelseViewModel[] = [
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
  faktaData: FeilutbetalingFaktaViewModel,
  årsakerData: FeilutbetalingÅrsakerPerYtelseViewModel[],
): FeilutbetalingFaktaApi => ({
  backend: 'k9tilbake',
  hentFeilutbetalingFakta: async () => faktaData,
  hentFeilutbetalingÅrsaker: async () => årsakerData,
});

const withFakeApi = (
  faktaData: FeilutbetalingFaktaViewModel,
  årsakerData: FeilutbetalingÅrsakerPerYtelseViewModel[],
): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <FeilutbetalingFaktaApiContext value={createFakeApi(faktaData, årsakerData)}>
        <FeilutbetalingKodeverkoppslagContext
          value={{
            hentHendelseTypeNavn: kode => kode ?? '',
            hentHendelseUnderTypeNavn: kode => kode ?? '',
            hentVidereBehandlingNavn: kode =>
              kode === 'TILBAKEKR_OPPRETT' ? 'Feilutbetaling med tilbakekreving' : (kode ?? ''),
          }}
        >
          <Suspense>
            <Story />
          </Suspense>
        </FeilutbetalingKodeverkoppslagContext>
      </FeilutbetalingFaktaApiContext>
    </QueryClientProvider>
  );
};

const meta = {
  title: 'gui/fakta/feilutbetaling/FeilutbetalingFaktaIndex',
  component: FeilutbetalingFaktaIndex,
  args: {
    behandlingUuid: 'test-uuid',
    behandlingVersjon: 1,
    fagsakYtelseType: 'PSB',
    readOnly: false,
    hasOpenAksjonspunkter: true,
    submitCallback: fn(),
  },
} satisfies Meta<typeof FeilutbetalingFaktaIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withK9Kodeverkoppslag(), withFakeApi(fakta, årsaker)],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('15.04.2024')).toBeInTheDocument();
    await expect(canvas.getByText('Feilutbetaling med tilbakekreving')).toBeInTheDocument();
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    hasOpenAksjonspunkter: false,
  },
  decorators: [withK9Kodeverkoppslag(), withFakeApi(faktaMedÅrsaker, årsaker)],
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('checkbox', { name: 'Behandle alle perioder samlet' })).not.toBeInTheDocument();
  },
};

export const MedEksisterendeÅrsaker: Story = {
  decorators: [withK9Kodeverkoppslag(), withFakeApi(faktaMedÅrsaker, årsaker)],
};

export const UtenPerioder: Story = {
  decorators: [withK9Kodeverkoppslag(), withFakeApi(faktaUtenPerioder, årsaker)],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ingen perioder med feilutbetaling')).toBeInTheDocument();
  },
};
