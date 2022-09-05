import { TextFieldFormik } from '@fpsak-frontend/form';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import shallowWithIntl, { intlMock } from '../../i18n';
import FritekstBrevPanel from './FritekstBrevPanel';
import PreviewLink from './PreviewLink';

describe('<FritekstBrevPanel>', () => {
  const eventCallback = sinon.spy();
  it('skal vise alle felter i readonly modus, men ikke autobrev link', () => {
    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly
        harAutomatiskVedtaksbrev
        formikProps={{ values: {} }}
      />,
    );

    const textArea = wrapper.find(TextAreaFormik);
    const textField = wrapper.find(TextFieldFormik);
    expect(textArea).to.have.length(1);
    expect(textField).to.have.length(1);
    expect(textArea.at(0).prop('readOnly')).to.equal(true);
    expect(textField.at(0).prop('readOnly')).to.equal(true);
    expect(wrapper.find(PreviewLink)).to.have.length(0);
  });

  it('skal vise alle felter i vanlig modus', () => {
    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly={false}
        harAutomatiskVedtaksbrev
        formikProps={{ values: {} }}
      />,
    );

    expect(wrapper.find(PreviewLink)).to.have.length(1);
    expect(wrapper.find(TextFieldFormik)).to.have.length(1);
    expect(wrapper.find(TextAreaFormik)).to.have.length(1);
  });
});
