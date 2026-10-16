import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Resultat } from '@k9-sak-web/backend/k9sak/kodeverk/sykdom/Resultat.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Suspense } from 'react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction.js';
import { FakeOmsorgenForBackendApi } from '../../storybook/mocks/FakeOmsorgenForBackendApi.js';
import type { OmsorgenForApi } from './api/OmsorgenForApi.js';
import { OmsorgenForApiContext } from './api/OmsorgenForApiContext.js';
import { OmsorgenFor } from './src/OmsorgenFor.js';

const api = new FakeOmsorgenForBackendApi();

const withApi =
  (api: OmsorgenForApi): Decorator =>
  Story => (
    <Suspense>
      <OmsorgenForApiContext value={api}>
        <Story />
      </OmsorgenForApiContext>
    </Suspense>
  );

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
    behandlingVersjon: 1,
  },
};

export const BekrefterVurderingAvPeriode: Story = {
  args: {
    readOnly: false,
    behandlingUuid: '123',
    onFinished: fn(),
    sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    behandlingVersjon: 1,
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
            resultat: Resultat.OPPFYLT,
            begrunnelse: 'Søker bor sammen med barnet i perioden',
          },
        ],
        undefined,
      );
    });
  },
};

export const Opplæringspenger: Story = {
  args: {
    ...DefaultStory.args,
    sakstype: fagsakYtelsesType.OPPLÆRINGSPENGER,
    onFinished: fn(),
  },
  play: async ({ canvas, args }) => {
    await expect(await canvas.findByRole('radio', { name: 'Ja' })).toBeVisible();
    await expect(canvas.getByRole('radio', { name: 'Nei' })).toBeVisible();
    await expect(canvas.queryByRole('radio', { name: 'Ja, i deler av perioden' })).not.toBeInTheDocument();
    await expect(canvas.getAllByRole('radio')).toHaveLength(2);
    await expect(canvas.getByText('Vurder om søker har omsorgen for barnet i perioden.')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Ja' }));
    await userEvent.type(
      canvas.getByLabelText(/Vurder om søker har omsorgen for barnet etter/),
      'Søker har omsorgen for barnet i hele perioden',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await waitFor(() => expect(args.onFinished).toHaveBeenCalledTimes(1));
    await expect(args.onFinished).toHaveBeenCalledWith(
      [
        {
          periode: { fom: '2021-03-20', tom: '2021-03-25' },
          resultat: Resultat.OPPFYLT,
          begrunnelse: 'Søker har omsorgen for barnet i hele perioden',
        },
      ],
      undefined,
    );
  },
};

export const IngenOmsorgsperioder: Story = {
  args: {
    ...DefaultStory.args,
    onFinished: fn(),
  },
  decorators: [
    withApi({
      backend: 'k9sak',
      getOmsorgsperioder: async () => ({ omsorgsperioder: [] }),
    }),
  ],
  play: async ({ canvas, args }) => {
    await expect(await canvas.findByText('Ingen vurderinger å vise')).toBeVisible();
    await expect(canvas.queryByText(/Vurder om søker har omsorgen/)).not.toBeInTheDocument();
    await expect(canvas.queryByRole('radio')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    await expect(args.onFinished).not.toHaveBeenCalled();
  },
};

export const TvungenManuellVurdering: Story = {
  args: {
    ...DefaultStory.args,
    onFinished: fn(),
  },
  decorators: [
    withApi({
      backend: 'k9sak',
      getOmsorgsperioder: async () => ({
        omsorgsperioder: [
          {
            periode: { fom: '2021-03-20', tom: '2021-03-25' },
            resultat: Resultat.IKKE_VURDERT,
            resultatEtterAutomatikk: Resultat.OPPFYLT,
            skalTvingesTilManuellVurdering: true,
          },
        ],
      }),
    }),
  ],
  play: async ({ canvas, args }) => {
    await expect(await canvas.findByRole('radio', { name: 'Ja' })).toBeVisible();
    await expect(canvas.getByRole('radio', { name: 'Ja, i deler av perioden' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'Nei' }));
    await userEvent.type(
      canvas.getByLabelText(/Vurder om søker har omsorgen for barnet etter/),
      'Søker har ikke omsorgen for barnet i perioden',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await waitFor(() => expect(args.onFinished).toHaveBeenCalledTimes(1));
    await expect(args.onFinished).toHaveBeenCalledWith(
      [
        {
          periode: { fom: '2021-03-20', tom: '2021-03-25' },
          resultat: Resultat.IKKE_OPPFYLT,
          begrunnelse: 'Søker har ikke omsorgen for barnet i perioden',
        },
      ],
      undefined,
    );
  },
};

export const LeggerTilFosterbarnOgBekrefter: Story = {
  args: {
    readOnly: false,
    behandlingUuid: '123',
    onFinished: fn(),
    sakstype: fagsakYtelsesType.OMSORGSPENGER,
    behandlingVersjon: 1,
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
            resultat: Resultat.OPPFYLT,
            begrunnelse: 'Søker bor sammen med barnet i perioden',
          },
        ],
        [{ fnr: '17420373147' }],
      );
    });
  },
};
