import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { SettPaVentModal } from './SettPaVentModal';

describe('<SettPaVentModal>', () => {
  it('skal rendre åpen modal', () => {
    const cancelEventCallback = vi.fn();

    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={cancelEventCallback}
        frist="frist"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        showModal
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Lukk' }).length).toBe(2);
    expect(screen.getByText('Behandlingen er satt på vent med frist:')).toBeInTheDocument();
  });

  it('skal ikke disable knapp for lagring når frist er en gyldig fremtidig dato', () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        frist="2099-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sett på vent' })).not.toBeDisabled();
  });

  it('skal disable knapp for lagring når frist er en ugyldig dato', () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        frist="20-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeDisabled();
  });

  it('skal disable knapp for lagring når frist er en historisk dato', () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sett på vent' })).toBeDisabled();
  });

  it('skal kunne velge årsak', async () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        frist="2099-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('skal ikke vise frist-input når behandling automatisk er satt på vent uten frist', () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent={false}
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.queryByPlaceholderText('dd.mm.åååå')).not.toBeInTheDocument();
  });

  it('skal vise frist-input når behandling automatisk er satt på vent med frist', () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        originalFrist="2015-10-10"
        ventearsaker={[]}
        hasManualPaVent={false}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByPlaceholderText('dd.mm.åååå')).toBeInTheDocument();
  });

  it('skal vise årsak-input som readonly når behandling automatisk er satt på vent', () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        ventearsaker={[]}
        hasManualPaVent={false}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('skal vise fristen tekst for tilbakekreving behandling venter på kravgrunnlag og fristen er utløpt', () => {
    renderWithIntlAndReduxForm(
      <SettPaVentModal
        intl={intlMock}
        showModal
        cancelEvent={vi.fn()}
        frist="2015-10-10"
        ventearsaker={[
          {
            kode: 'VENT_PÅ_TILBAKEKREVINGSGRUNNLAG',
            kodeverk: 'VENT_AARSAK',
            navn: 'Venter på kravgrunnlag',
          },
        ]}
        ventearsak="VENT_PÅ_TILBAKEKREVINGSGRUNNLAG"
        hasManualPaVent={false}
        erTilbakekreving
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByText('Behandlingen settes på vent med frist')).toBeInTheDocument();
  });
});
