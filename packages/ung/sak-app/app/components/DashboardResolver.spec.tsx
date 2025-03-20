import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi';
import { DashboardResolver } from './DashboardResolver';

describe('<DashboardResolver>', () => {
  const messages = { 'DashboardResolver.FpLosErNede': 'Forsiden har nedetid' };
  const kodeverk = {};
  it('skal vise fremsiden til fpsak når miljø er lik development', () => {
    requestApi.mock(UngSakApiKeys.KODEVERK, kodeverk);
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
