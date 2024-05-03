import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import messages from '../../i18n/nb_NO.json';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';

describe('<ForeldelseTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(<ForeldelseTidslinjeHjelpetekster intl={intlMock} />, { messages });

    expect(screen.getAllByRole('img').length).toBe(4);
  });
});
