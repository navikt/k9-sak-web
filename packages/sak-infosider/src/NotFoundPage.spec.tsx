import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import messages from '../i18n/nb_NO.json';
import NotFoundPage from './NotFoundPage';

describe('<NotFoundPage>', () => {
  it('skal rendre NotFoundPage korrekt', () => {
    renderWithIntl(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Beklager, vi finner ikke siden du leter etter.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gå til forsiden' })).toBeInTheDocument();
  });
});
