import { render, screen } from '@testing-library/react';
import { SettPåVentModal } from './SettPåVentModal';

describe('<SettPaVentModal>', () => {
  it('skal rendre åpen modal', () => {
    const cancelEventCallback = vi.fn();

    render(
      <SettPåVentModal
        cancelEvent={cancelEventCallback}
        frist="2099-10-10"
        submitCallback={vi.fn()}
        ventearsak="ventearsak"
        hasManualPaVent
        erTilbakekreving={false}
        erKlage={false}
        showModal
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Lukk' }).length).toBe(2);
    expect(screen.getAllByText('Behandlingen er satt på vent med frist:')).toHaveLength(2);
  });

  it('skal ikke disable knapp for lagring når frist er en gyldig fremtidig dato', () => {
    render(
      <SettPåVentModal
        showModal
        cancelEvent={vi.fn()}
        frist="2099-10-10"
        submitCallback={vi.fn()}
        ventearsak="ventearsak"
        hasManualPaVent
        erTilbakekreving={false}
        erKlage={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sett på vent' })).not.toBeDisabled();
  });

  it('skal disable knapp for lagring når frist er en ugyldig dato', () => {
    render(
      <SettPåVentModal
        showModal
        cancelEvent={vi.fn()}
        frist="1999-10-10"
        ventearsak="ventearsak"
        submitCallback={vi.fn()}
        hasManualPaVent
        erTilbakekreving={false}
        erKlage={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeDisabled();
  });

  it('skal disable knapp for lagring når frist er en historisk dato', () => {
    render(
      <SettPåVentModal
        showModal
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        submitCallback={vi.fn()}
        ventearsak="ventearsak"
        hasManualPaVent
        erTilbakekreving={false}
        erKlage={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeDisabled();
  });

  it('skal kunne velge årsak', async () => {
    render(
      <SettPåVentModal
        showModal
        cancelEvent={vi.fn()}
        frist="2099-10-10"
        submitCallback={vi.fn()}
        ventearsak="ventearsak"
        hasManualPaVent
        erTilbakekreving={false}
        erKlage={false}
      />,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('skal ikke vise frist-input når behandling automatisk er satt på vent uten frist', () => {
    render(
      <SettPåVentModal
        showModal
        submitCallback={vi.fn()}
        cancelEvent={vi.fn()}
        ventearsak="ventearsak"
        hasManualPaVent={false}
        erTilbakekreving={false}
        erKlage={false}
      />,
    );
    expect(screen.queryByPlaceholderText('dd.mm.åååå')).not.toBeInTheDocument();
  });

  it('skal vise frist-input når behandling automatisk er satt på vent med frist', () => {
    render(
      <SettPåVentModal
        showModal
        submitCallback={vi.fn()}
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        hasManualPaVent={false}
        erTilbakekreving={false}
        erKlage={false}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Behandlingen settes på vent med frist' })).toBeInTheDocument();
  });

  it('skal vise årsak-input som readonly når behandling automatisk er satt på vent', () => {
    render(
      <SettPåVentModal
        showModal
        submitCallback={vi.fn()}
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        hasManualPaVent={false}
        erTilbakekreving={false}
        erKlage={false}
      />,
    );

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('skal vise fristen tekst for tilbakekreving behandling venter på kravgrunnlag og fristen er utløpt', () => {
    render(
      <SettPåVentModal
        showModal
        submitCallback={vi.fn()}
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        ventearsak="VENT_PÅ_TILBAKEKREVINGSGRUNNLAG"
        hasManualPaVent={false}
        erTilbakekreving
        erKlage={false}
      />,
    );
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getAllByText('Behandlingen er satt på vent med frist:')).toHaveLength(2);
  });
});
