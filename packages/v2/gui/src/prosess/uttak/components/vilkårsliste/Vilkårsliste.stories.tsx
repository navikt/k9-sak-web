import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import Vilkårsliste from './Vilkårsliste.js';

const meta = {
  title: 'gui/prosess/Uttak/Vilkårsliste',
  component: Vilkårsliste,
  tags: ['uttak'],
} satisfies Meta<typeof Vilkårsliste>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BlandetOppfyltOgIkkeOppfylt: Story = {
  args: {
    vilkår: {
      [vilkarType.MEDLEMSKAPSVILKÅRET]: vilkårStatus.OPPFYLT,
      [vilkarType.OPPTJENINGSVILKÅRET]: vilkårStatus.IKKE_OPPFYLT,
      [vilkarType.SØKNADSFRIST]: vilkårStatus.OPPFYLT,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Medlemskap:')).toBeInTheDocument();
    await expect(canvas.getByText('Opptjening:')).toBeInTheDocument();
    await expect(canvas.getByText('Søknadsfrist:')).toBeInTheDocument();
    await expect(canvas.getAllByText('Oppfylt')).toHaveLength(2);
    await expect(canvas.getAllByText('Ikke oppfylt')).toHaveLength(1);
    await expect(canvas.queryByText('Omsorgen for:')).not.toBeInTheDocument();
  },
};

export const Opplæringspenger: Story = {
  args: {
    vilkår: {
      [vilkarType.LANGVARIG_SYKDOM]: vilkårStatus.OPPFYLT,
      [vilkarType.NØDVENDIG_OPPLÆRING]: vilkårStatus.OPPFYLT,
      [vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON]: vilkårStatus.IKKE_OPPFYLT,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Langvarig sykdom:')).toBeInTheDocument();
    await expect(canvas.getByText('Nødvendig opplæring:')).toBeInTheDocument();
    await expect(canvas.getByText('Institusjon:')).toBeInTheDocument();
    await expect(canvas.getAllByText('Oppfylt')).toHaveLength(2);
    await expect(canvas.getAllByText('Ikke oppfylt')).toHaveLength(1);
  },
};

export const AlleVilkår: Story = {
  args: {
    vilkår: {
      [vilkarType.MEDLEMSKAPSVILKÅRET]: vilkårStatus.OPPFYLT,
      [vilkarType.SØKNADSFRIST]: vilkårStatus.OPPFYLT,
      [vilkarType.OPPTJENINGSVILKÅRET]: vilkårStatus.IKKE_OPPFYLT,
      [vilkarType.BEREGNINGSGRUNNLAGVILKÅR]: vilkårStatus.OPPFYLT,
      [vilkarType.OMSORGEN_FOR]: vilkårStatus.OPPFYLT,
      [vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR]: vilkårStatus.OPPFYLT,
      [vilkarType.MEDISINSKEVILKÅR_18_ÅR]: vilkårStatus.IKKE_OPPFYLT,
      [vilkarType.ALDERSVILKÅR]: vilkårStatus.OPPFYLT,
      [vilkarType.LANGVARIG_SYKDOM]: vilkårStatus.OPPFYLT,
      [vilkarType.NØDVENDIG_OPPLÆRING]: vilkårStatus.IKKE_OPPFYLT,
      [vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON]: vilkårStatus.OPPFYLT,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(11);
    await expect(canvas.getAllByText('Oppfylt')).toHaveLength(8);
    await expect(canvas.getAllByText('Ikke oppfylt')).toHaveLength(3);
  },
};
