import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { FormattedMessage } from 'react-intl';
import { UngSakApiKeys, requestApi } from '../data/ungsakApi';
import LanguageProvider from './LanguageProvider';

describe('<LanguageProvider>', () => {
  it('skal sette opp react-intl', () => {
    requestApi.mock(UngSakApiKeys.LANGUAGE_FILE, {
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
