import type { ArbeidOgInntektResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Suspense } from 'react';
import { ArbeidOgInntektApiContext } from './api/ArbeidOgInntektApiContext.js';
import ArbeidOgInntektFaktaIndex from './ArbeidOgInntektFaktaIndex.js';
import { withQueryClientProvider } from '../../storybook/decorators/withQueryClientProvider.js';

const withFakeApi = (data: ArbeidOgInntektResponse[]): Decorator => {
  return Story => (
    <ArbeidOgInntektApiContext value={{ hentArbeidOgInntekt: async () => data }}>
      <Suspense>
        <Story />
      </Suspense>
    </ArbeidOgInntektApiContext>
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
        aRegister: {
          organisasjonsnummer: '123456789',
          ansettelsesperiode: { fom: '2021-07-13', tom: '2023-01-31' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2023-01-15T10:00:00',
        },
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
        aRegister: {
          organisasjonsnummer: '123456789',
          ansettelsesperiode: { fom: '2020-07-13', tom: '2020-08-31' },
          stillingsprosent: 50,
          permisjoner: [],
          sistEndret: '2020-09-01T08:00:00',
        },
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
  decorators: [withK9Kodeverkoppslag(), withQueryClientProvider()],
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
            aRegister: {
              organisasjonsnummer: '923456789',
              ansettelsesperiode: { fom: '2020-01-01', tom: '' },
              stillingsprosent: 100,
              permisjoner: [],
              sistEndret: '2020-01-10T12:00:00',
            },
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

const enkeltCaseData = [
  {
    skjæringstidspunkt: '2024-03-01',
    aktiviteter: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Kremmerhuset AS',
        ansettelsesperiode: { fom: '2015-06-01', tom: '' },
        normalarbeidstidTimerPerUke: 37.5,
        beregningsgrunnlagPrÅr: 450000,
        fordelingsprosent: 100,
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '987654321',
          ansettelsesperiode: { fom: '2015-06-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2024-02-15T09:30:00',
        },
      },
    ],
    senereInnslag: [],
  },
] satisfies ArbeidOgInntektResponse[];

export const EnkeltCaseEnArbeidsgiver: Story = {
  decorators: [withFakeApi(enkeltCaseData)],
  args: {
    behandlingUuid: 'test-uuid',
  },
};

const nyInntektEtterSkjæringstidspunktData = [
  {
    skjæringstidspunkt: '2024-03-01',
    aktiviteter: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Kremmerhuset AS',
        ansettelsesperiode: { fom: '2015-06-01', tom: '' },
        normalarbeidstidTimerPerUke: 37.5,
        beregningsgrunnlagPrÅr: 450000,
        fordelingsprosent: 100,
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '987654321',
          ansettelsesperiode: { fom: '2015-06-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2024-02-15T09:30:00',
        },
      },
    ],
    senereInnslag: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Ny Arbeidsplass AS',
        ansettelsesperiode: { fom: '2024-04-15', tom: '' },
        harRefusjonskrav: false,
        aRegister: {
          organisasjonsnummer: '912345678',
          ansettelsesperiode: { fom: '2024-04-15', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2024-04-20T11:00:00',
        },
      },
    ],
  },
] satisfies ArbeidOgInntektResponse[];

export const NyInntektEtterSkjæringstidspunkt: Story = {
  decorators: [withFakeApi(nyInntektEtterSkjæringstidspunktData)],
  args: {
    behandlingUuid: 'test-uuid',
  },
};

const toSkjæringstidspunktFlereArbeidsgivereData = [
  {
    skjæringstidspunkt: '2023-01-10',
    aktiviteter: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Nordlys Handel AS',
        ansettelsesperiode: { fom: '2018-03-01', tom: '' },
        normalarbeidstidTimerPerUke: 37.5,
        beregningsgrunnlagPrÅr: 380000,
        fordelingsprosent: 80,
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '934567890',
          ansettelsesperiode: { fom: '2018-03-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2023-01-05T09:00:00',
        },
      },
      {
        arbeidsstatus: 'FL',
        arbeidsgiverNavn: undefined,
        ansettelsesperiode: { fom: '2020-09-01', tom: '' },
        normalarbeidstidTimerPerUke: 5,
        beregningsgrunnlagPrÅr: 60000,
        fordelingsprosent: 20,
        harRefusjonskrav: undefined,
      },
    ],
    senereInnslag: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Sørvest Bygg AS',
        ansettelsesperiode: { fom: '2023-06-01', tom: '' },
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '945678901',
          ansettelsesperiode: { fom: '2023-06-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2023-06-10T13:00:00',
        },
      },
    ],
  },
  {
    skjæringstidspunkt: '2024-05-20',
    aktiviteter: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Nordlys Handel AS',
        ansettelsesperiode: { fom: '2018-03-01', tom: '' },
        normalarbeidstidTimerPerUke: 37.5,
        beregningsgrunnlagPrÅr: 390000,
        fordelingsprosent: 75,
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '934567890',
          ansettelsesperiode: { fom: '2018-03-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2024-05-05T09:00:00',
        },
      },
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Sørvest Bygg AS',
        ansettelsesperiode: { fom: '2023-06-01', tom: '' },
        normalarbeidstidTimerPerUke: 20,
        beregningsgrunnlagPrÅr: 210000,
        fordelingsprosent: 25,
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '945678901',
          ansettelsesperiode: { fom: '2023-06-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2024-05-05T09:00:00',
        },
      },
      {
        arbeidsstatus: 'SN',
        arbeidsgiverNavn: undefined,
        ansettelsesperiode: { fom: '2021-01-01', tom: '' },
        normalarbeidstidTimerPerUke: 8,
        beregningsgrunnlagPrÅr: 90000,
        fordelingsprosent: 0,
        harRefusjonskrav: undefined,
      },
    ],
    senereInnslag: [
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Fjelltind Transport AS',
        ansettelsesperiode: { fom: '2024-08-01', tom: '' },
        harRefusjonskrav: false,
        aRegister: {
          organisasjonsnummer: '956789012',
          ansettelsesperiode: { fom: '2024-08-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2024-08-10T10:00:00',
        },
      },
      {
        arbeidsstatus: 'AT',
        arbeidsgiverNavn: 'Fjelltind Transport AS',
        ansettelsesperiode: { fom: '2024-11-01', tom: '' },
        harRefusjonskrav: true,
        aRegister: {
          organisasjonsnummer: '956789012',
          ansettelsesperiode: { fom: '2024-11-01', tom: '' },
          stillingsprosent: 100,
          permisjoner: [],
          sistEndret: '2024-11-05T10:00:00',
        },
      },
    ],
  },
] satisfies ArbeidOgInntektResponse[];

export const ToSkjæringstidspunktFlereArbeidsgivere: Story = {
  decorators: [withFakeApi(toSkjæringstidspunktFlereArbeidsgivereData)],
  args: {
    behandlingUuid: 'test-uuid',
  },
};
