import { Period } from '@fpsak-frontend/utils';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import InnleggelsesperiodeFormModal from '../InnleggelsesperiodeFormModal';

const renderModal = (fagsakYtelseType: FagsakYtelsesType) => {
  const onSubmit = vi.fn();
  render(
    <InnleggelsesperiodeFormModal
      defaultValues={{
        innleggelsesperioder: [new Period('2025-01-01', '2025-01-10'), new Period('2025-02-01', '2025-02-05')],
      }}
      setModalIsOpen={vi.fn()}
      onSubmit={onSubmit}
      isLoading={false}
      endringerPåvirkerAndreBehandlinger={vi.fn().mockResolvedValue({ førerTilRevurdering: false })}
      pleietrengendePart={undefined}
      fagsakYtelseType={fagsakYtelseType}
    />,
  );
  return onSubmit;
};

const endreTilDato = async (index: number, dato: string) => {
  const tilFelt = screen.getAllByRole('textbox', { name: 'Til' })[index];
  await userEvent.clear(tilFelt);
  await userEvent.type(tilFelt, dato);
  await userEvent.tab();
};

const bekreft = () => userEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

describe('InnleggelsesperiodeFormModal', () => {
  describe('pleiepenger i livets sluttfase', () => {
    it('krever begrunnelse og sender endring når en periode endres', async () => {
      const onSubmit = renderModal(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE);

      await endreTilDato(0, '15.01.2025');
      const begrunnelse = await screen.findByRole('textbox', { name: 'Begrunn endring av perioden' });

      await bekreft();
      expect(await screen.findByText('Du må oppgi begrunnelse')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();

      await userEvent.type(begrunnelse, 'Forlenget opphold');
      await bekreft();

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit.mock.calls[0][0].endringer).toEqual([
        {
          fraPeriode: expect.objectContaining({ fom: '2025-01-01', tom: '2025-01-10' }),
          tilPeriode: expect.objectContaining({ fom: '2025-01-01', tom: '2025-01-15' }),
          begrunnelse: 'Forlenget opphold',
        },
      ]);
    });

    it('skjuler begrunnelsesfeltet når perioden endres tilbake til opprinnelig verdi', async () => {
      const onSubmit = renderModal(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE);

      await endreTilDato(0, '15.01.2025');
      expect(await screen.findByRole('textbox', { name: 'Begrunn endring av perioden' })).toBeInTheDocument();

      await endreTilDato(0, '10.01.2025');
      await waitFor(() =>
        expect(screen.queryByRole('textbox', { name: 'Begrunn endring av perioden' })).not.toBeInTheDocument(),
      );

      await bekreft();
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit.mock.calls[0][0].endringer).toBeUndefined();
    });

    it('krever begrunnelse og sender endring når en periode slettes', async () => {
      const onSubmit = renderModal(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE);

      await userEvent.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);
      expect(screen.getByText('Slettede innleggelsesperioder')).toBeInTheDocument();
      expect(screen.getByText('01.02.2025 – 05.02.2025')).toBeInTheDocument();

      await bekreft();
      expect(await screen.findByText('Du må oppgi begrunnelse')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();

      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn sletting av perioden' }), 'Feilregistrert');
      await bekreft();

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit.mock.calls[0][0].endringer).toEqual([
        {
          fraPeriode: expect.objectContaining({ fom: '2025-02-01', tom: '2025-02-05' }),
          tilPeriode: null,
          begrunnelse: 'Feilregistrert',
        },
      ]);
    });

    it('godtar ikke begrunnelse som bare består av mellomrom', async () => {
      const onSubmit = renderModal(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE);

      await userEvent.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn sletting av perioden' }), '   ');
      await bekreft();

      expect(await screen.findByText('Du må oppgi begrunnelse')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('andre ytelser', () => {
    it('viser ikke begrunnelsesfelt og sender ikke endringer ved endring og sletting', async () => {
      const onSubmit = renderModal(fagsakYtelsesType.PLEIEPENGER_SYKT_BARN);

      await endreTilDato(0, '15.01.2025');
      await userEvent.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);

      expect(screen.queryByRole('textbox', { name: 'Begrunn endring av perioden' })).not.toBeInTheDocument();
      expect(screen.queryByText('Slettede innleggelsesperioder')).not.toBeInTheDocument();

      await bekreft();
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit.mock.calls[0][0].endringer).toBeUndefined();
    });
  });
});
