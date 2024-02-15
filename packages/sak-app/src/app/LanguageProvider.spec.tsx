import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import LanguageProvider from './LanguageProvider';

describe('<LanguageProvider>', () => {
  it('skal sette opp react-intl', () => {
    requestApi.mock(K9sakApiKeys.LANGUAGE_FILE, {
      'Header.Foreldrepenger': 'Foreldrepenger',
    });

    renderWithIntl(
      <LanguageProvider>
        <FormattedMessage id="Header.Foreldrepenger" tagName="span" />
      </LanguageProvider>,
    );
    expect(screen.getByText('Foreldrepenger')).toBeInTheDocument();
  });
});
