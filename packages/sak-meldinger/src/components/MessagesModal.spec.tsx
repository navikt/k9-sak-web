import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import MessagesModal from './MessagesModal';

describe('<MessagesModal>', () => {
  it('skal vise modal', () => {
    const closeCallback = vi.fn();
    renderWithIntl(<MessagesModal.WrappedComponent showModal closeEvent={closeCallback} intl={intlMock} />, {
      messages,
    });

    expect(screen.getByRole('dialog', { name: 'Brevet er bestilt' })).toBeInTheDocument();
  });
});
