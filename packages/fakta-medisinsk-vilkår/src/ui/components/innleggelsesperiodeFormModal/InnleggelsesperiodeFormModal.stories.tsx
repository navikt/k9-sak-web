import { Period } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import type { InnleggelsesperiodeDryRunResponse } from '../../../api/api';
import InnleggelsesperiodeFormModal from './InnleggelsesperiodeFormModal';

const endreTilDato = async (index: number, dato: string) => {
  const tilFelt = screen.getAllByRole('textbox', { name: 'Til' })[index];
  await userEvent.clear(tilFelt);
  await userEvent.type(tilFelt, dato);
  await userEvent.tab();
};

const bekreft = () => userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

const utenEndringer = expect.not.objectContaining({ endringer: expect.anything() });

const meta: Meta<typeof InnleggelsesperiodeFormModal> = {
  title: 'fakta/fakta-medisinsk-vilkår/InnleggelsesperiodeFormModal',
  component: InnleggelsesperiodeFormModal,
  args: {
    defaultValues: {
      innleggelsesperioder: [new Period('2025-01-01', '2025-01-10'), new Period('2025-02-01', '2025-02-05')],
    },
    setModalIsOpen: fn(),
    onSubmit: fn(),
    isLoading: false,
    endringerPåvirkerAndreBehandlinger: fn((): Promise<InnleggelsesperiodeDryRunResponse> =>
      Promise.resolve({ førerTilRevurdering: false }),
    ),
    pleietrengendePart: undefined,
    fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
  },
};

export default meta;
type Story = StoryObj<typeof InnleggelsesperiodeFormModal>;

export const LivetsSluttfaseEndretPeriodeKreverBegrunnelse: Story = {
  args: { onSubmit: fn() },
  play: async ({ args }) => {
    await endreTilDato(0, '15.01.2025');
    const begrunnelse = await screen.findByRole('textbox', { name: 'Begrunn endring av perioden' });

    await bekreft();
    await expect(await screen.findByText('Feltet må fylles ut')).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();

    await userEvent.type(begrunnelse, 'Forlenget opphold');
    await bekreft();

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endringer: [
          {
            fraPeriode: expect.objectContaining({ fom: '2025-01-01', tom: '2025-01-10' }),
            tilPeriode: expect.objectContaining({ fom: '2025-01-01', tom: '2025-01-15' }),
            begrunnelse: 'Forlenget opphold',
          },
        ],
      }),
    );
  },
};

export const LivetsSluttfasePeriodeEndretTilbake: Story = {
  args: { onSubmit: fn() },
  play: async ({ args }) => {
    await endreTilDato(0, '15.01.2025');
    await expect(await screen.findByRole('textbox', { name: 'Begrunn endring av perioden' })).toBeInTheDocument();

    await endreTilDato(0, '10.01.2025');
    await waitFor(() =>
      expect(screen.queryByRole('textbox', { name: 'Begrunn endring av perioden' })).not.toBeInTheDocument(),
    );

    await bekreft();
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    await expect(args.onSubmit).toHaveBeenCalledWith(utenEndringer);
  },
};

export const LivetsSluttfaseSlettetPeriodeKreverBegrunnelse: Story = {
  args: { onSubmit: fn() },
  play: async ({ args }) => {
    await userEvent.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);
    await expect(screen.getByText('Slettede innleggelsesperioder')).toBeInTheDocument();
    await expect(screen.getByText('01.02.2025 – 05.02.2025')).toBeInTheDocument();

    await bekreft();
    await expect(await screen.findByText('Feltet må fylles ut')).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();

    await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn sletting av perioden' }), 'Feilregistrert');
    await bekreft();

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endringer: [
          {
            fraPeriode: expect.objectContaining({ fom: '2025-02-01', tom: '2025-02-05' }),
            tilPeriode: undefined,
            begrunnelse: 'Feilregistrert',
          },
        ],
      }),
    );
  },
};

export const LivetsSluttfaseBegrunnelseMedBareMellomrom: Story = {
  args: { onSubmit: fn() },
  play: async ({ args }) => {
    await userEvent.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);
    await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn sletting av perioden' }), '   ');
    await bekreft();

    await expect(await screen.findByText('Feltet må fylles ut')).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const AndreYtelserNyRadEtterSletting: Story = {
  args: { fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, onSubmit: fn() },
  play: async ({ args }) => {
    await userEvent.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);
    await userEvent.click(screen.getByRole('button', { name: 'Legg til innleggelsesperiode' }));

    const fraFelt = screen.getAllByRole('textbox', { name: 'Fra' })[1];
    const tilFelt = screen.getAllByRole('textbox', { name: 'Til' })[1];
    await expect(fraFelt).toHaveValue('');
    await expect(tilFelt).toHaveValue('');

    await userEvent.type(fraFelt, '01.03.2025');
    await userEvent.tab();
    await userEvent.type(tilFelt, '05.03.2025');
    await userEvent.tab();
    await bekreft();

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        innleggelsesperioder: [
          expect.objectContaining({ period: expect.objectContaining({ fom: '2025-01-01', tom: '2025-01-10' }) }),
          {
            period: expect.objectContaining({ fom: '2025-03-01', tom: '2025-03-05' }),
            begrunnelse: '',
            opprinneligPeriode: null,
          },
        ],
      }),
    );
  },
};

export const AndreYtelserUtenBegrunnelse: Story = {
  args: { fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, onSubmit: fn() },
  play: async ({ args }) => {
    await endreTilDato(0, '15.01.2025');
    await userEvent.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);

    await expect(screen.queryByRole('textbox', { name: 'Begrunn endring av perioden' })).not.toBeInTheDocument();
    await expect(screen.queryByText('Slettede innleggelsesperioder')).not.toBeInTheDocument();

    await bekreft();
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    await expect(args.onSubmit).toHaveBeenCalledWith(utenEndringer);
  },
};
