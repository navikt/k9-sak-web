import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { TextFieldFormik } from '@fpsak-frontend/form';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';

import shallowWithIntl, { intlMock } from '../../i18n';
import FritekstBrevPanel from './FritekstBrevPanel';
import PreviewLink from './PreviewLink';

const alleTilgjengeligeVedtaksbrev = {
  vedtaksbrevmaler: {
    [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
    [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
    [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS,
    [vedtaksbrevtype.INGEN]: null,
  },
};

describe('<FritekstBrevPanel>', () => {
  const eventCallback = sinon.spy();
  it('skal vise alle felter i readonly modus, men ikke autobrev link', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: false }]);
    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly
        harAutomatiskVedtaksbrev
        formikProps={{ values: { skalBrukeOverstyrendeFritekstBrev: true } }}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find('.textAreaContainer--readOnly')).to.have.length(1);
    expect(wrapper.find(PreviewLink)).to.have.length(0);
  });

  it('skal vise alle felter i vanlig modus', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: true }]);

    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly={false}
        harAutomatiskVedtaksbrev
        formikProps={{ values: { skalBrukeOverstyrendeFritekstBrev: true } }}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(PreviewLink)).to.have.length(1);
    expect(wrapper.find('.textAreaContainer')).to.have.length(1);
  });
});
