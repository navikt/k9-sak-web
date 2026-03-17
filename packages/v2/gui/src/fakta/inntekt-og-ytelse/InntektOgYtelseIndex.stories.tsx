import type { InntekterDto } from '@k9-sak-web/backend/k9sak/kontrakt/opptjening/InntekterDto.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { InntektOgYtelseApiContext } from './api/InntektOgYtelseApiContext.js';
import type { InntektOgYtelseApi } from './api/InntektOgYtelseApi.js';
import InntektOgYtelseIndex from './InntektOgYtelseIndex.js';

const withFakeApi =
  (inntekter: InntekterDto): Decorator =>
  Story => {
    const fakeApi: InntektOgYtelseApi = {
      hentInntekter: () => Promise.resolve(inntekter),
    };
    return (
      <InntektOgYtelseApiContext value={fakeApi}>
        <Story />
      </InntektOgYtelseApiContext>
    );
  };

const inntekterMock: InntekterDto = {
  inntekt: [
    {
      fom: '2023-01-01',
      tom: '2023-01-31',
      utbetaler: 'ACME AS',
      belop: 50000,
      ytelse: false,
      navn: 'Lønn',
    },
    {
      fom: '2023-02-01',
      tom: '2023-02-28',
      utbetaler: 'NAV',
      belop: 30000,
      ytelse: true,
      navn: 'Sykepenger',
    },
  ],
};

const meta = {
  title: 'gui/fakta/inntekt-og-ytelse/InntektOgYtelseIndex',
  component: InntektOgYtelseIndex,
} satisfies Meta<typeof InntektOgYtelseIndex>;

export default meta;

type Story = StoryObj<typeof InntektOgYtelseIndex>;

export const MedInntekter: Story = {
  args: {
    behandlingUuid: 'test-uuid',
  },
  decorators: [withFakeApi(inntekterMock)],
};

export const TomListe: Story = {
  args: {
    behandlingUuid: 'test-uuid',
  },
  decorators: [withFakeApi({ inntekt: [] })],
};
