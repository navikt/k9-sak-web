import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import messages from '../../i18n/nb_NO.json';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';

describe('<ForeldelseTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(<ForeldelseTidslinjeHjelpetekster intl={intlMock} />, { messages });

    expect(screen.getAllByRole('img').length).toBe(4);
  });
});
