import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { FatterVedtakApprovalModal } from './FatterVedtakApprovalModal';
import shallowWithIntl from '../../../i18n';

describe('<FatterVedtakApprovalModal>', () => {
  const closeEventCallback = sinon.spy();
  it('skal rendre modal for fatter vedtak', () => {
    const wrapper = shallowWithIntl(
      <FatterVedtakApprovalModal
        intl={intlMock}
        showModal
        infoTextCode="testInfo"
        altImgTextCode="HelpText.Aksjonspunkt" // random intl ID
        modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescription"
        closeEvent={closeEventCallback}
        resolveProsessAksjonspunkterSuccess
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.');

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });

  it('skal rendre modal for iverksetter vedtak', () => {
    const wrapper = shallowWithIntl(
      <FatterVedtakApprovalModal
        intl={intlMock}
        showModal
        infoTextCode="testInfo"
        altImgTextCode="HelpText.Aksjonspunkt" // random intl ID
        modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescriptionPleiePengerApproval"
        closeEvent={closeEventCallback}
        resolveProsessAksjonspunkterSuccess
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql(
      'Pleiepenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.',
    );

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });

  it('skal rendre modal for iverksetter vedtak Pleiepenger', () => {
    const wrapper = shallowWithIntl(
      <FatterVedtakApprovalModal
        intl={intlMock}
        showModal
        infoTextCode="testInfo"
        altImgTextCode="HelpText.Aksjonspunkt" // random intl ID
        modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescriptionPleiePengerApproval"
        closeEvent={closeEventCallback}
        resolveProsessAksjonspunkterSuccess
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql(
      'Pleiepenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.',
    );

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });

  it('skal lukke modal ved trykk på knapp', () => {
    const wrapper = shallowWithIntl(
      <FatterVedtakApprovalModal
        intl={intlMock}
        showModal={false}
        infoTextCode="testInfo"
        altImgTextCode="HelpText.Aksjonspunkt" // random intl ID
        modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescriptionPleiePengerApproval"
        closeEvent={closeEventCallback}
        resolveProsessAksjonspunkterSuccess
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.false;

    const button = wrapper.find(Hovedknapp);
    expect(closeEventCallback).to.have.property('callCount', 0);
    button.simulate('click');
    expect(closeEventCallback).to.have.property('callCount', 1);
  });
});
