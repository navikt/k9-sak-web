import React from 'react';
import sinon from 'sinon';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import FatterVedtakStatusModal from './FatterVedtakStatusModal';

describe('<FatterVedtakStatusModal>', () => {
  const closeEventCallback = sinon.spy();

  it('skal rendre modal for fatter vedtak', () => {
    const wrapper = shallowWithIntl(
      <FatterVedtakStatusModal.WrappedComponent
        intl={intlMock}
        visModal
        tekstkode="FatterVedtakStatusModal.KlagenErFerdigbehandlet"
        lukkModal={closeEventCallback}
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).toHaveLength(1);
    expect(modal.prop('isOpen')).toBe(true);
    expect(modal.prop('contentLabel')).toEqual('Klagen er ferdigbehandlet.');

    const button = wrapper.find(Hovedknapp);
    expect(button).toHaveLength(1);
  });
});
