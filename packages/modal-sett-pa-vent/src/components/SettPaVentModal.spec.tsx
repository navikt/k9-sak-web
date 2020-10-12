import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import shallowWithIntl from '../../i18n';

import { SettPaVentModal } from './SettPaVentModal';

describe('<SettPaVentModal>', () => {
  it('skal rendre åpen modal', () => {
    const cancelEventCallback = sinon.spy();

    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={cancelEventCallback}
        frist="frist"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        showModal
        {...reduxFormPropsMock}
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Behandlingen er satt på vent');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
  });

  it('skal ikke disable knapp for lagring når frist er en gyldig fremtidig dato', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        frist="2099-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
    );

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.false;
  });

  it('skal disable knapp for lagring når frist er en ugyldig dato', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        frist="20-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
    );

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal disable knapp for lagring når frist er en historisk dato', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        frist="2015-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
    );

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal være obligatorisk å velge årsak', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        frist="2099-10-10"
        originalFrist="frist"
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
    );
    const select = wrapper.find(SelectField);
    expect(select.prop('validate')).to.have.length(1);
  });

  it('skal ikke vise frist-input når behandling automatisk er satt på vent uten frist', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        ventearsak="ventearsak"
        originalVentearsak="ventearsak"
        hasManualPaVent={false}
        ventearsaker={[]}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });

  it('skal vise frist-input når behandling automatisk er satt på vent med frist', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        frist="2015-10-10"
        ventearsaker={[]}
        hasManualPaVent={false}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(DatepickerField)).to.have.length(1);
  });

  it('skal vise årsak-input som readonly når behandling automatisk er satt på vent', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        frist="2015-10-10"
        ventearsaker={[]}
        hasManualPaVent={false}
        erTilbakekreving={false}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(SelectField).prop('readOnly')).is.true;
  });

  xit('skal vise fristen tekst for tilbakekreving behandling venter på kravgrunnlag og fristen er utløpt', () => {
    const wrapper = shallowWithIntl(
      <SettPaVentModal
        intl={intlMock}
        cancelEvent={sinon.spy()}
        frist="2015-10-10"
        ventearsaker={[
          {
            kode: 'VENT_PÅ_TILBAKEKREVINGSGRUNNLAG',
            kodeverk: 'VENT_AARSAK',
            navn: 'Venter på kravgrunnlag',
          },
        ]}
        ventearsak="VENT_PÅ_TILBAKEKREVINGSGRUNNLAG"
        hasManualPaVent={false}
        erTilbakekreving
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(SelectField).prop('readOnly')).is.true;
    const label = wrapper.find(Normaltekst);
    expect(label).to.have.length(2);
    expect(label.first().childAt(0).prop('id')).is.eql('SettPaVentModal.SettesPaVent');
    expect(label.at(1).childAt(0).prop('id')).is.eql('SettPaVentModal.UtløptFrist');
    expect(label.at(1).childAt(2).prop('id')).is.eql('SettPaVentModal.HenleggeSaken');
  });
});
