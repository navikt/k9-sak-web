import React from 'react';
import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { screen } from '@testing-library/react';
import TimeLineSokerEnsamSoker from './TimeLineSokerEnsamSoker';

describe('<TimeLineSokerEnsamSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    renderWithIntl(<TimeLineSokerEnsamSoker hovedsokerKjonnKode="K" />, { 'Person.ImageText': 'Personinformasjon' });
    const images = screen.getAllByAltText('Personinformasjon');
    expect(images.length).toBe(1);
    expect(screen.getByText('Kvinne')).toBeInTheDocument();
    expect(screen.queryByText('Mann')).not.toBeInTheDocument();
  });
});
