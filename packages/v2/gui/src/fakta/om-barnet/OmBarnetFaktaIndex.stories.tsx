import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { RettVedDødType } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/RettVedDødType.js';
import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import withErrorBoundary from '../../storybook/decorators/withErrorBoundary.js';
import { withFakeOmBarnetApi } from '../../storybook/decorators/withFakeOmBarnetApi.js';
import type { BekreftRettVedDødAksjonspunkt } from './BekreftRettVedDødAksjonspunkt.js';
import OmBarnetFaktaIndex from './OmBarnetFaktaIndex.js';
import { rett12UkerTekst, rett6UkerTekst } from './rettVedDødUtfallTekst.js';

const pleietrengende = {
  navn: 'Kari Nordmann',
  fnr: '01011912345',
  diagnosekoder: ['NA08'],
  dodsdato: '2025-03-14',
} satisfies PersonopplysningPleietrengendeDto;

const lagretVurdering = {
  rettVedDødType: RettVedDødType.RETT_6_UKER,
  vurdering: 'Søker har mottatt pleiepenger i under tre år.',
  vurdertAv: 'Z123456',
  vurdertTidspunkt: '2025-04-02T10:15:00',
} satisfies VurderingRettPleiepengerVedDødDto;

// Simulerer backend: vurderingen som hentes endres når aksjonspunktet er løst
let backendVurdering: VurderingRettPleiepengerVedDødDto | null = null;

const meta = {
  title: 'gui/fakta/om-barnet/OmBarnetFaktaIndex',
  component: OmBarnetFaktaIndex,
  decorators: [
    withFakeOmBarnetApi({
      pleietrengende,
      hentRettVedDød: async () => backendVurdering,
    }),
  ],
  beforeEach: () => {
    backendVurdering = null;
  },
  args: {
    behandlingUuid: 'test-behandling-uuid',
    readOnly: false,
    submittable: true,
    harAksjonspunkt: true,
    submitCallback: fn(async () => {}),
  },
} satisfies Meta<typeof OmBarnetFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NyVurderingLagresOgViserOppdatertVurdering: Story = {
  args: {
    submitCallback: fn(async (aksjonspunkter: BekreftRettVedDødAksjonspunkt[]) => {
      for (const { vurdering, rettVedDødType } of aksjonspunkter) {
        backendVurdering = {
          vurdering,
          rettVedDødType,
          vurdertAv: 'Z999999',
          vurdertTidspunkt: '2025-05-01T09:00:00',
        };
      }
    }),
  },
  play: async ({ canvas, args, step }) => {
    await step('Henter opplysninger om barnet og viser tomt skjema uten lagret vurdering', async () => {
      await expect(await canvas.findByRole('heading', { name: 'Om barnet' })).toBeInTheDocument();
      await expect(canvas.getByText('Kari Nordmann')).toBeInTheDocument();
      await expect(canvas.getByText('Død 14.03.2025')).toBeInTheDocument();
      await expect(canvas.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('');
    });

    await step('Sender aksjonspunkt og viser den nye vurderingen etter lagring', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: rett12UkerTekst }));
      await userEvent.type(canvas.getByRole('textbox', { name: 'Vurdering' }), 'Tre år eller mer.');
      await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await expect(args.submitCallback).toHaveBeenCalledWith([
        {
          kode: AksjonspunktDefinisjon.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD,
          begrunnelse: 'Rett etter pleietrengendes død er behandlet',
          vurdering: 'Tre år eller mer.',
          rettVedDødType: RettVedDødType.RETT_12_UKER,
        },
      ]);
      await waitFor(() => expect(canvas.getByText('Vurdering av Z999999, 01.05.2025')).toBeInTheDocument());
      await expect(canvas.getByText(rett12UkerTekst)).toBeInTheDocument();
      await expect(canvas.getByText('Tre år eller mer.')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Rediger vurdering' })).toBeInTheDocument();
    });
  },
};

export const LagretVurdering: Story = {
  beforeEach: () => {
    backendVurdering = lagretVurdering;
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(rett6UkerTekst)).toBeInTheDocument();
    await expect(canvas.getByText(lagretVurdering.vurdering)).toBeInTheDocument();
    await expect(canvas.getByText('Vurdering av Z123456, 02.04.2025')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Rediger vurdering' })).toBeInTheDocument();
  },
};

export const UtenAksjonspunktOgVurdering: Story = {
  args: { harAksjonspunkt: false },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Kari Nordmann')).toBeInTheDocument();
    await expect(
      canvas.queryByRole('heading', { name: 'Rett til pleiepenger ved barnets død' }),
    ).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const UtenAksjonspunktMedVurdering: Story = {
  args: { harAksjonspunkt: false },
  beforeEach: () => {
    backendVurdering = lagretVurdering;
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(rett6UkerTekst)).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const SkrivebeskyttetBehandling: Story = {
  args: { readOnly: true },
  beforeEach: () => {
    backendVurdering = lagretVurdering;
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(rett6UkerTekst)).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const IngenOpplysningerOmBarnet: Story = {
  decorators: [
    withFakeOmBarnetApi({
      pleietrengende: null,
      hentRettVedDød: async () => null,
    }),
  ],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Ingen opplysninger om barnet.')).toBeInTheDocument();
  },
};

export const FeilVedHentingAvVurdering: Story = {
  decorators: [
    withErrorBoundary({ errorFallback: ({ error }) => <p>Feil: {error.message}</p> }),
    withFakeOmBarnetApi({
      pleietrengende,
      hentRettVedDød: async () => {
        throw new Error('Henting av vurdering feilet');
      },
    }),
  ],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Feil: Henting av vurdering feilet')).toBeInTheDocument();
    await expect(canvas.queryByRole('textbox', { name: 'Vurdering' })).not.toBeInTheDocument();
  },
};
