import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import { EndreBehandlendeEnhetModal } from './EndreBehandlendeEnhetModal';

describe('<ChangeBehandlendeEnhetModal>', () => {
  const behandlendeEnheter = [
    {
      enhetId: '001',
      enhetNavn: 'NAV',
      status: 'Aktiv',
    },
  ];

  it('skal rendre åpen modal', () => {
    renderWithIntlAndReduxForm(
      <EndreBehandlendeEnhetModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        lukkModal={vi.fn()}
        behandlendeEnheter={behandlendeEnheter}
        gjeldendeBehandlendeEnhetId="002"
        gjeldendeBehandlendeEnhetNavn="Oslo"
        nyEnhet="Test3"
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
      />,
      { messages },
    );

    expect(screen.getByRole('dialog', { name: 'Endre behandlende enhet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).not.toBeDisabled();
  });

  it('skal vise nedtrekksliste med behandlende enheter', () => {
    renderWithIntlAndReduxForm(
      <EndreBehandlendeEnhetModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        lukkModal={vi.fn()}
        behandlendeEnheter={behandlendeEnheter}
        gjeldendeBehandlendeEnhetId="002"
        gjeldendeBehandlendeEnhetNavn="Oslo"
        nyEnhet="Test"
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Ny enhet' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '002 Oslo' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '001 NAV' })).toBeInTheDocument();
  });

  it('skal disable knapp for lagring når ny behandlende enhet og begrunnnelse ikke er valgt', () => {
    renderWithIntlAndReduxForm(
      <EndreBehandlendeEnhetModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        lukkModal={vi.fn()}
        behandlendeEnheter={behandlendeEnheter}
        gjeldendeBehandlendeEnhetId="002"
        gjeldendeBehandlendeEnhetNavn="Oslo"
        intl={intlMock}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
  });

  it('skal bruke submit-callback når en trykker ok', async () => {
    const submitEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <EndreBehandlendeEnhetModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        lukkModal={vi.fn()}
        behandlendeEnheter={behandlendeEnheter}
        gjeldendeBehandlendeEnhetId="002"
        gjeldendeBehandlendeEnhetNavn="Oslo"
        nyEnhet="Test"
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });
    expect(submitEventCallback.mock.calls.length).toBeGreaterThan(0);
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', async () => {
    const cancelEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <EndreBehandlendeEnhetModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        lukkModal={cancelEventCallback}
        behandlendeEnheter={behandlendeEnheter}
        gjeldendeBehandlendeEnhetId="002"
        gjeldendeBehandlendeEnhetNavn="Oslo"
        nyEnhet="Test"
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });
    expect(cancelEventCallback.mock.calls.length).toBeGreaterThan(0);
  });
});
