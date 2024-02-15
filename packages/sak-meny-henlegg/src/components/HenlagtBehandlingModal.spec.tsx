import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import HenlagtBehandlingModal from './HenlagtBehandlingModal';

describe('<HenlagtBehandlingModal>', () => {
  it('skal rendre åpen modal', () => {
    renderWithIntl(<HenlagtBehandlingModal.WrappedComponent showModal closeEvent={sinon.spy()} intl={intlMock} />, {
      messages,
    });

    expect(screen.getByRole('dialog', { name: 'Behandlingen er henlagt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('skal rendre lukket modal', () => {
    renderWithIntl(
      <HenlagtBehandlingModal.WrappedComponent showModal={false} closeEvent={sinon.spy()} intl={intlMock} />,
      { messages },
    );
    expect(screen.queryByRole('dialog', { name: 'Behandlingen er henlagt' })).not.toBeInTheDocument();
  });
});
