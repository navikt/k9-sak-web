import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import ErrorPageWrapper from './ErrorPageWrapper';

describe('<ErrorPageWrapper>', () => {
  it('skal rendre ErrorPageWrapper korrekt', () => {
    renderWithIntl(
      <ErrorPageWrapper>
        <article>pageContent</article>
      </ErrorPageWrapper>,
      { messages },
    );
    expect(screen.getByRole('heading', { name: 'Noe gikk galt' })).toBeInTheDocument();
    expect(screen.getByText('pageContent')).toBeInTheDocument();
  });
});
