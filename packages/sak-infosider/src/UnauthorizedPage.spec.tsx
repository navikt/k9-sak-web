import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import messages from '../i18n/nb_NO.json';
import UnauthorizedPage from './UnauthorizedPage';

describe('<UnauthorizedPage>', () => {
  it('skal rendre UnauthorizedPage korrekt', () => {
    renderWithIntl(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Du må logge inn for å få tilgang til systemet' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gå til innloggingssiden' })).toBeInTheDocument();
  });
});
