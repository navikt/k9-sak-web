import type { ArbeidOgInntektResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Suspense } from 'react';
import { ArbeidOgInntektApiContext } from './api/ArbeidOgInntektApiContext.js';
import ArbeidOgInntektFaktaIndex from './ArbeidOgInntektFaktaIndex.js';

const withFakeApi = (data: ArbeidOgInntektResponse[]): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <ArbeidOgInntektApiContext value={{ hentArbeidOgInntekt: async () => data }}>
        <Suspense>
          <Story />
        </Suspense>
      </ArbeidOgInntektApiContext>
    </QueryClientProvider>
  );
};

const mockData: ArbeidOgInntektResponse[] = [
  {
    skjæringstidspunkt: '2019-05-12',
    aktiviteter: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Andersens Kostebinderi AS',
        ansettelsesperiode: { fom: '2010-07-13', tom: '2020-01-31' },
        normalarbeidstidTimerPerUke: 35,
        beregningsgrunnlagPrÅr: 320000,
        fordelingsprosent: 70,
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '123456789',
          ansettelsesperiode: { fom: '2019-11-03', tom: '2020-01-31' },
          stillingsprosent: 100,
          permisjoner: [{ type: 'foreldrepermisjon', periode: { fom: '2020-01-01', tom: '2020-01-31' } }],
          sistEndret: '2019-09-12T14:00:00',
        },
      },
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Arbeidsgiver AS',
        ansettelsesperiode: { fom: '2019-11-03', tom: '' },
        normalarbeidstidTimerPerUke: 10,
        beregningsgrunnlagPrÅr: 100000,
        fordelingsprosent: 10,
        harRefusjonskrav: false,
        aRegister: {
          organisasjonsnummer: '123456789',
          ansettelsesperiode: { fom: '2019-11-03', tom: '2020-01-31' },
          stillingsprosent: 100,
          permisjoner: [{ type: 'foreldrepermisjon', periode: { fom: '2020-01-01', tom: '2020-01-31' } }],
          sistEndret: '2019-09-12T14:00:00',
        },
      },
      {
        arbeidsstatus: 'FL',
        arbeidsgiverNavn: undefined,
        ansettelsesperiode: { fom: '2017-04-04', tom: '' },
        normalarbeidstidTimerPerUke: 3,
        beregningsgrunnlagPrÅr: 100000,
        fordelingsprosent: 10,
        harRefusjonskrav: undefined,
      },
      {
        arbeidsstatus: 'SN',
        arbeidsgiverNavn: undefined,
        ansettelsesperiode: { fom: '2019-11-03', tom: '2026-01-31' },
        normalarbeidstidTimerPerUke: 10,
        beregningsgrunnlagPrÅr: 100000,
        fordelingsprosent: 10,
        harRefusjonskrav: undefined,
      },
    ],
    senereInnslag: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Det andre Kostebinderi AS',
        ansettelsesperiode: { fom: '2021-07-13', tom: '2023-01-31' },
        harRefusjonskrav: false,
      },
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Det andre Kostebinderi AS',
        ansettelsesperiode: { fom: '2023-02-01', tom: '' },
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '123456789',
          ansettelsesperiode: { fom: '2022-07-13', tom: '' },
          stillingsprosent: 100,
          permisjoner: [{ type: 'foreldrepermisjon', periode: { fom: '2020-01-01', tom: '2020-01-31' } }],
          sistEndret: '2025-02-21T17:23:00',
        },
      },
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'En arbeidsplass til AS',
        ansettelsesperiode: { fom: '2020-07-13', tom: '2020-08-31' },
        harRefusjonskrav: true,
      },
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'En arbeidsplass til AS',
        ansettelsesperiode: { fom: '2022-07-13', tom: '' },
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '123456789',
          ansettelsesperiode: { fom: '2022-07-13', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2025-02-21T17:23:00',
        },
      },
    ],
  },
];

const meta = {
  title: 'fakta/arbeid-og-inntekt/ArbeidOgInntektFaktaIndex',
  component: ArbeidOgInntektFaktaIndex,
  decorators: [withK9Kodeverkoppslag()],
} satisfies Meta<typeof ArbeidOgInntektFaktaIndex>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withFakeApi(mockData)],
  args: {
    behandlingUuid: 'test-uuid',
  },
};

export const FlereSkjæringstidspunkt: Story = {
  decorators: [
    withFakeApi([
      ...mockData,
      {
        skjæringstidspunkt: '2020-01-01',
        aktiviteter: [
          {
            arbeidsstatus: 'AT',
            arbeidsgiverNavn: 'Ny Arbeidsgiver AS',
            ansettelsesperiode: { fom: '2020-01-01', tom: '' },
            normalarbeidstidTimerPerUke: 37.5,
            beregningsgrunnlagPrÅr: 500000,
            fordelingsprosent: 100,
            harRefusjonskrav: true,
          },
        ],
        senereInnslag: [],
      },
    ]),
  ],
  args: {
    behandlingUuid: 'test-uuid',
  },
};

export const IngenData: Story = {
  decorators: [withFakeApi([])],
  args: {
    behandlingUuid: 'test-uuid',
  },
};
