import { intlMock } from '@fpsak-frontend/utils-test/intl-enzyme-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';

describe('<ForeldelseTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(<ForeldelseTidslinjeHjelpetekster intl={intlMock} />, { messages });

    expect(screen.getAllByRole('img').length).toBe(4);
  });
});
