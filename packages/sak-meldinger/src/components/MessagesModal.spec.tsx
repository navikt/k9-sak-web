import React from 'react';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import MessagesModal from './MessagesModal';
import shallowWithIntl from '../../i18n/index';

describe('<MessagesModal>', () => {
  it('skal vise modal', () => {
    const closeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <MessagesModal.WrappedComponent showModal closeEvent={closeCallback} intl={intlMock} />,
    );

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).toBe(true);
    expect(modal.prop('onRequestClose')).toEqual(closeCallback);
  });
});
