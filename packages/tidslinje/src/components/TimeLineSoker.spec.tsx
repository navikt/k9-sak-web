import React from 'react';
// eslint-disable-next-line import/extensions
import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { KjønnkodeEnum } from '@k9-sak-web/types/src/Kjønnkode';
import { screen } from '@testing-library/react';
import TimeLineSoker from './TimeLineSoker';

describe('<TimeLineSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    renderWithIntl(
      <TimeLineSoker hovedsokerKjonnKode={KjønnkodeEnum.KVINNE} medsokerKjonnKode={KjønnkodeEnum.MANN} />,
      { 'Person.ImageText': 'Personinformasjon' },
    );
    const images = screen.getAllByAltText('Personinformasjon');
    expect(images.length).toBe(2);
    expect(screen.getByText('Kvinne')).toBeInTheDocument();
    expect(screen.getByText('Mann')).toBeInTheDocument();
  });
});
