import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import messages from '../i18n/nb_NO.json';
import IngenBehandlingValgtPanel from './IngenBehandlingValgtPanel';

describe('<IngenBehandlingValgtPanel>', () => {
  it('skal rendre korrekt melding ved 0 behandlinger', () => {
    renderWithIntl(
      <MemoryRouter>
        <IngenBehandlingValgtPanel numBehandlinger={0} />
      </MemoryRouter>,
      { messages },
    );
    expect(screen.getByText('Ingen behandlinger er opprettet')).toBeInTheDocument();
  });

  it('skal rendre korrekt melding ved to behandlinger', () => {
    renderWithIntl(
      <MemoryRouter>
        <IngenBehandlingValgtPanel numBehandlinger={2} />
      </MemoryRouter>,
      { messages },
    );

    expect(screen.getByText('Velg behandling')).toBeInTheDocument();
  });
});
