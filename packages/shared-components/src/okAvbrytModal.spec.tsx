import React from 'react';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import OkAvbrytModal from './OkAvbrytModal';

describe('<OkAvbrytModal>', () => {
  it('skal rendre modal', () => {
    const wrapper = shallowWithIntl(
      <OkAvbrytModal.WrappedComponent
        intl={intlMock}
        textCode="OkAvbrytModal.OpenBehandling"
        showModal
        cancel={sinon.spy()}
        submit={sinon.spy()}
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).toHaveLength(1);
    expect(modal.prop('isOpen')).toBe(true);
    expect(modal.prop('contentLabel')).toEqual('OkAvbrytModal.OpenBehandling');

    const message = wrapper.find(FormattedMessage);
    expect(message).toHaveLength(1);
    expect(message.prop('id')).toEqual('OkAvbrytModal.OpenBehandling');
  });
});
