import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import messages from '../i18n/nb_NO.json';
import ErrorPage from './ErrorPage';

describe('<ErrorPage>', () => {
  it('skal rendre ErrorPage korrekt', () => {
    renderWithIntl(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
      { messages },
    );
    expect(
      screen.getAllByText(
        (_, element) =>
          element.textContent ===
          'Det har oppstått en teknisk feil i denne behandlingen. Meld feilen i Porten. Ta med feilmeldingsteksten.',
      )[0],
    ).toBeInTheDocument();
  });
});
