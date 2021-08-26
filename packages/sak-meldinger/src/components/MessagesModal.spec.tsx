import React from 'react';
import sinon from 'sinon';

import Modal from 'nav-frontend-modal';

import MessagesModal from './MessagesModal';
import shallowWithIntl, { intlMock } from '../../i18n/index';

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
