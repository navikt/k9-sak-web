import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction.js';
import { FakeOmsorgenForBackendApi } from '../../storybook/mocks/FakeOmsorgenForBackendApi.js';
import type { OmsorgenForApi } from './api/OmsorgenForApi.js';
import { OmsorgenForApiContext } from './api/OmsorgenForApiContext.js';
import { OmsorgenFor } from './src/OmsorgenFor.js';
import Vurderingsresultat from './src/types/Vurderingsresultat.js';

const api = new FakeOmsorgenForBackendApi();

const withApi = (api: OmsorgenForApi): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <OmsorgenForApiContext value={api}>
          <Story />
        </OmsorgenForApiContext>
      </Suspense>
    </QueryClientProvider>
  );
};

const meta = {
  title: 'gui/fakta/omsorgen-for',
  component: OmsorgenFor,
  decorators: [withApi(api)],
} satisfies Meta<typeof OmsorgenFor>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    readOnly: false,
    behandlingUuid: '123',
    onFinished: asyncAction('onFinished'),
    sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  },
};

export const BekrefterVurderingAvPeriode: Story = {
  args: {
    readOnly: false,
    behandlingUuid: '123',
    onFinished: fn(),
    sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  },
  play: async ({ canvas, args, step }) => {
    await step('Skal vurdere periode til vurdering og bekrefte', async () => {
      await waitFor(() => expect(canvas.getByLabelText('Ja')).toBeInTheDocument());
      await userEvent.click(canvas.getByLabelText('Ja'));
      await userEvent.type(
        canvas.getByLabelText(/Vurder om søker har omsorgen for barnet etter/),
        'Søker bor sammen med barnet i perioden',
      );
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.onFinished).toHaveBeenCalledTimes(1));
      await expect(args.onFinished).toHaveBeenCalledWith(
        [
          {
            periode: { fom: '2021-03-20', tom: '2021-03-25' },
            resultat: Vurderingsresultat.OPPFYLT,
            begrunnelse: 'Søker bor sammen med barnet i perioden',
          },
        ],
        undefined,
      );
    });
  },
};

export const LeggerTilFosterbarnOgBekrefter: Story = {
  args: {
    readOnly: false,
    behandlingUuid: '123',
    onFinished: fn(),
    sakstype: fagsakYtelsesType.OMSORGSPENGER,
  },
  play: async ({ canvas, args, step }) => {
    await step('Skal legge til fosterbarn og bekrefte vurdering', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Legg til fosterbarn' }));
      await userEvent.type(canvas.getByLabelText('Fødselsnummer'), '17420373147');
      await waitFor(() => expect(canvas.getByLabelText('Ja')).toBeInTheDocument());
      await userEvent.click(canvas.getByLabelText('Ja'));
      await userEvent.type(
        canvas.getByLabelText(/Vurder om søker har omsorg for barn etter/),
        'Søker bor sammen med barnet i perioden',
      );
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.onFinished).toHaveBeenCalledTimes(1));
      await expect(args.onFinished).toHaveBeenCalledWith(
        [
          {
            periode: { fom: '2021-03-20', tom: '2021-03-25' },
            resultat: Vurderingsresultat.OPPFYLT,
            begrunnelse: 'Søker bor sammen med barnet i perioden',
          },
        ],
        ['17420373147'],
      );
    });
  },
};
