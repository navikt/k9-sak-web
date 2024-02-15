import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import { DashboardResolver } from './DashboardResolver';

describe('<DashboardResolver>', () => {
  const messages = { 'DashboardResolver.FpLosErNede': 'Forsiden har nedetid' };
  const kodeverk = {};
  it('skal vise fremsiden til fpsak når miljø er lik development', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    renderWithIntlAndReduxForm(
      <MemoryRouter>
        <DashboardResolver intl={intlMock} />
      </MemoryRouter>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Søk på sak eller person' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Saksnummer eller fødselsnummer/D-nummer' })).toBeInTheDocument();
  });
});
