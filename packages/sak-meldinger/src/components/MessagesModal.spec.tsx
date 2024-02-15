import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import MessagesModal from './MessagesModal';

describe('<MessagesModal>', () => {
  it('skal vise modal', () => {
    const closeCallback = sinon.spy();
    renderWithIntl(<MessagesModal.WrappedComponent showModal closeEvent={closeCallback} intl={intlMock} />, {
      messages,
    });

    expect(screen.getByRole('dialog', { name: 'Brevet er bestilt' })).toBeInTheDocument();
  });
});
