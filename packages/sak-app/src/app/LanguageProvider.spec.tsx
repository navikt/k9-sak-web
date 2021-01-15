import React from 'react';
import { FormattedMessage } from 'react-intl';

import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import LanguageProvider from './LanguageProvider';

describe('<LanguageProvider>', () => {
  it('skal sette opp react-intl', () => {
    requestApi.mock(K9sakApiKeys.LANGUAGE_FILE, {
      'Header.Foreldrepenger': 'Foreldrepenger',
    });

    const wrapper = mountWithIntl(
      <LanguageProvider>
        <FormattedMessage id="Header.Foreldrepenger" tagName="span" />
      </LanguageProvider>,
    );
    const intlProvider = wrapper.find('IntlProvider');
    expect(intlProvider).toHaveLength(1);
    expect(intlProvider.prop('messages')).toEqual({ 'Header.Foreldrepenger': 'Foreldrepenger' });
    const span = wrapper.find('span');
    expect(span).toHaveLength(1);
    expect(span.text()).toEqual('Foreldrepenger');
  });
});
