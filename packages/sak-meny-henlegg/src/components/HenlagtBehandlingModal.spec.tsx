import { intlWithMessages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import HenlagtBehandlingModal from './HenlagtBehandlingModal';

const intlMock = intlWithMessages(messages);

describe('<HenlagtBehandlingModal>', () => {
  it('skal rendre åpen modal', () => {
    renderWithIntl(<HenlagtBehandlingModal.WrappedComponent showModal closeEvent={vi.fn()} intl={intlMock} />, {
      messages,
    });

    expect(screen.getByRole('dialog', { name: 'Behandlingen er henlagt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('skal rendre lukket modal', () => {
    renderWithIntl(<HenlagtBehandlingModal.WrappedComponent showModal={false} closeEvent={vi.fn()} intl={intlMock} />, {
      messages,
    });
    expect(screen.queryByRole('dialog', { name: 'Behandlingen er henlagt' })).not.toBeInTheDocument();
  });
});
