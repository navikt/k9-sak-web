import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';

describe('<TilbakekrevingTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(<TilbakekrevingTidslinjeHjelpetekster.WrappedComponent intl={intlMock} />, { messages });
    expect(screen.getByText('Beløp tilbakekreves')).toBeInTheDocument();
    expect(screen.getByText('Ingen tilbakekreving')).toBeInTheDocument();
    expect(screen.getByText('Uavklart periode')).toBeInTheDocument();
  });
});
