import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, waitFor, userEvent } from '@storybook/test';
import { Period } from '@navikt/ft-utils';
import FaktaInstitusjonIndex from './FaktaInstitusjonIndex';
import type { InstitusjonVurderingDtoMedPerioder } from './types/InstitusjonVurderingDtoMedPerioder';
import type { InstitusjonPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

const meta: Meta<typeof FaktaInstitusjonIndex> = {
  title: 'gui/fakta/institusjon',
  component: FaktaInstitusjonIndex,
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockPerioder: InstitusjonPeriodeDto[] = [
  {
    periode: {
      fom: '2023-01-01',
      tom: '2023-03-31',
    },
    institusjon: 'Oslo Universitetssykehus',
    journalpostId: { journalpostId: '123456789' },
  },
];

const mockVurderinger: InstitusjonVurderingDtoMedPerioder[] = [
  {
    journalpostId: { journalpostId: '123456789' },
    perioder: [new Period('2023-01-01', '2023-03-31')],
    resultat: InstitusjonVurderingDtoResultat.GODKJENT_MANUELT,
    begrunnelse: 'Pasienten har behov for kontinuerlig oppfølging',
    institusjon: 'Oslo Universitetssykehus',
    vurdertAv: 'Saksbehandler',
    vurdertTidspunkt: '2023-03-31T12:00:00.000Z',
  },
];

export const Default: Story = {
  args: {
    perioder: mockPerioder,
    vurderinger: mockVurderinger,
    readOnly: false,
    løsAksjonspunkt: fn(),
  },
  play: async ({ canvas, args, step }) => {
    await step('Sjekk existing vurdering', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /01.01.2023 - 31.03.2023/i }));

      await waitFor(() => expect(canvas.getByTestId('Periode')).toHaveTextContent('01.01.2023 - 31.03.2023'));
      await waitFor(() => expect(canvas.getByText('Oslo Universitetssykehus')).toBeInTheDocument());
      await waitFor(() =>
        expect(canvas.getByText('Pasienten har behov for kontinuerlig oppfølging')).toBeInTheDocument(),
      );
    });

    await step('Endre vurdering', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Endre vurdering' }));

      await userEvent.type(canvas.getByTestId('begrunnelse'), 'Test vurdering');
      await userEvent.click(canvas.getByText('Ja'));
      await userEvent.click(canvas.getByText('Bekreft og fortsett'));

      await waitFor(() => expect(args.løsAksjonspunkt).toHaveBeenCalledTimes(1));
      await expect(args.løsAksjonspunkt).toHaveBeenCalledWith({
        begrunnelse: 'Test vurdering',
        godkjent: true,
        journalpostId: {
          journalpostId: '123456789',
        },
      });
    });
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true,
  },
  play: async ({ canvas, step }) => {
    await step('Sjekk detaljer har ikke endre vurdering knapp', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /01.01.2023 - 31.03.2023/i }));
      await waitFor(() => expect(canvas.queryByRole('button', { name: 'Endre vurdering' })).toBeNull());
    });
  },
};

export const DetailsWithNotApprovedVurdering: Story = {
  args: {
    perioder: [mockPerioder[0]!],
    vurderinger: [
      {
        ...mockVurderinger[0]!,
        resultat: InstitusjonVurderingDtoResultat.IKKE_GODKJENT_MANUELT,
        begrunnelse: 'Institusjonen er ikke godkjent for denne type opplæring',
      },
    ],
    readOnly: false,
    løsAksjonspunkt: fn(),
  },
  play: async ({ canvas, step }) => {
    await step('Sjekk vurdering ikke godkjent', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /01.01.2023 - 31.03.2023/i }));
      await waitFor(() => {
        void expect(canvas.getByText('Nei')).toBeInTheDocument();
        void expect(canvas.getByText('Institusjonen er ikke godkjent for denne type opplæring')).toBeInTheDocument();
      });
    });
  },
};

export const IngenPerioder: Story = {
  args: {
    perioder: [],
    vurderinger: [],
    readOnly: false,
    løsAksjonspunkt: fn(),
  },
  play: async ({ canvas, step }) => {
    await step('Sjekk ingen perioder', async () => {
      await waitFor(() => void expect(canvas.getByText('Ingen vurderinger å vise')).toBeInTheDocument());
    });
  },
};
