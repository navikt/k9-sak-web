import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import FritekstBrevPanel from './FritekstBrevPanel';
import shallowWithIntl, { intlMock } from '../../i18n';
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
    expect(textArea).to.have.length(2);
    expect(textArea.at(0).prop('readOnly')).to.equal(true);
    expect(textArea.at(1).prop('readOnly')).to.equal(true);
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
    expect(wrapper.find(TextAreaFormik)).to.have.length(2);
  });
});
