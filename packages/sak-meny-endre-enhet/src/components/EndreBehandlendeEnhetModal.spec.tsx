import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { reduxForm } from 'redux-form';
import sinon from 'sinon';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import { EndreBehandlendeEnhetModal } from './EndreBehandlendeEnhetModal';

describe('<ChangeBehandlendeEnhetModal>', () => {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);
  const behandlendeEnheter = [
    {
      enhetId: '001',
      enhetNavn: 'NAV',
      status: 'Aktiv',
    },
  ];

  it('skal rendre åpen modal', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <EndreBehandlendeEnhetModal
          {...reduxFormPropsMock}
          handleSubmit={sinon.spy()}
          lukkModal={sinon.spy()}
          behandlendeEnheter={behandlendeEnheter}
          gjeldendeBehandlendeEnhetId="002"
          gjeldendeBehandlendeEnhetNavn="Oslo"
          nyEnhet="Test3"
          begrunnelse="Dette er en begrunnelse"
          intl={intlMock}
        />
      </MockForm>,
      { messages },
    );

    expect(screen.getByRole('dialog', { name: 'Endre behandlende enhet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).not.toBeDisabled();
  });

  it('skal vise nedtrekksliste med behandlende enheter', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <EndreBehandlendeEnhetModal
          {...reduxFormPropsMock}
          handleSubmit={sinon.spy()}
          lukkModal={sinon.spy()}
          behandlendeEnheter={behandlendeEnheter}
          gjeldendeBehandlendeEnhetId="002"
          gjeldendeBehandlendeEnhetNavn="Oslo"
          nyEnhet="Test"
          begrunnelse="Dette er en begrunnelse"
          intl={intlMock}
        />
      </MockForm>,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Ny enhet' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '002 Oslo' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '001 NAV' })).toBeInTheDocument();
  });

  it('skal disable knapp for lagring når ny behandlende enhet og begrunnnelse ikke er valgt', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <EndreBehandlendeEnhetModal
          {...reduxFormPropsMock}
          handleSubmit={sinon.spy()}
          lukkModal={sinon.spy()}
          behandlendeEnheter={behandlendeEnheter}
          gjeldendeBehandlendeEnhetId="002"
          gjeldendeBehandlendeEnhetNavn="Oslo"
          intl={intlMock}
        />{' '}
      </MockForm>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled();
  });

  it('skal bruke submit-callback når en trykker ok', async () => {
    const submitEventCallback = sinon.spy();
    renderWithIntlAndReduxForm(
      <MockForm>
        <EndreBehandlendeEnhetModal
          {...reduxFormPropsMock}
          handleSubmit={submitEventCallback}
          lukkModal={sinon.spy()}
          behandlendeEnheter={behandlendeEnheter}
          gjeldendeBehandlendeEnhetId="002"
          gjeldendeBehandlendeEnhetNavn="Oslo"
          nyEnhet="Test"
          begrunnelse="Dette er en begrunnelse"
          intl={intlMock}
        />
      </MockForm>,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });
    expect(submitEventCallback.called).toBe(true);
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', async () => {
    const cancelEventCallback = sinon.spy();
    renderWithIntlAndReduxForm(
      <MockForm>
        <EndreBehandlendeEnhetModal
          {...reduxFormPropsMock}
          handleSubmit={sinon.spy()}
          lukkModal={cancelEventCallback}
          behandlendeEnheter={behandlendeEnheter}
          gjeldendeBehandlendeEnhetId="002"
          gjeldendeBehandlendeEnhetNavn="Oslo"
          nyEnhet="Test"
          begrunnelse="Dette er en begrunnelse"
          intl={intlMock}
        />
      </MockForm>,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });
    expect(cancelEventCallback.called).toBe(true);
  });
});
