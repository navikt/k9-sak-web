import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import messages from '../i18n/nb_NO.json';
import ForbiddenPage from './ForbiddenPage';

describe('<ForbiddenPage>', () => {
  it('skal rendre ForbiddenPage korrekt', () => {
    renderWithIntl(
      <MemoryRouter>
        <ForbiddenPage />
      </MemoryRouter>,
      { messages },
    );
    expect(
      screen.getByRole('heading', { name: 'Du har ikke tilgang til å slå opp denne personen' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gå til forsiden' })).toBeInTheDocument();
  });
});
