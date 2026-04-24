import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';

describe('<TilbakekrevingTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(<TilbakekrevingTidslinjeHjelpetekster />, { messages });
    expect(screen.getByText('Beløp tilbakekreves')).toBeInTheDocument();
    expect(screen.getByText('Ingen tilbakekreving')).toBeInTheDocument();
    expect(screen.getByText('Uavklart periode')).toBeInTheDocument();
  });
});
