import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';

describe('<ForeldelseTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(<ForeldelseTidslinjeHjelpetekster intl={intlMock} />, { messages });

    expect(screen.getAllByRole('img').length).toBe(4);
  });
});
