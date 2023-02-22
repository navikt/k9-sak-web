import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import shallowWithIntl, { intlMock } from '../../i18n';
import FritekstBrevPanel from './FritekstBrevPanel';
import PreviewLink from './PreviewLink';

describe('<FritekstBrevPanel>', () => {
  const eventCallback = sinon.spy();

  it('skal vise manuelt fritekstbrev i read only', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: false }]);

    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
        [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      },
    };

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

    expect(wrapper.find('.readOnly')).to.have.length(1);
    expect(wrapper.find(PreviewLink)).to.have.length(0);
    expect(wrapper.find('[data-testid="harIkkeAutomatiskVedtaksbrev"]')).to.have.length(0);
    expect(wrapper.find('[data-testid="harAutomatiskVedtaksbrev"]')).to.have.length(0);
  });

  it('skal vise manuelt fritekstbrev', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: true }]);

    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
        [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      },
    };

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

    expect(wrapper.find('.manueltBrevFormContainer')).to.have.length(1);
    expect(wrapper.find('[data-testid="harAutomatiskVedtaksbrev"]')).to.have.length(1);
  });

  it('skal vise manuelt brev uten automatisk vedtaksbrev', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: true }]);

    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
      },
    };

    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly={false}
        harAutomatiskVedtaksbrev={false}
        formikProps={{ values: { skalBrukeOverstyrendeFritekstBrev: true } }}
        tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find('.manueltBrevFormContainer')).to.have.length(1);
    expect(wrapper.find('[data-testid="harIkkeAutomatiskVedtaksbrev"]')).to.have.length(1);
    expect(wrapper.find('[data-testid="harAutomatiskVedtaksbrev"]')).to.have.length(0);
  });
});
