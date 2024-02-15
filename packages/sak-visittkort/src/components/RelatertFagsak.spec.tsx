import { render, screen } from '@testing-library/react';
import React from 'react';
import RelatertFagsak from './RelatertFagsak';

describe('<RelatertFagsak>', () => {
  const relaterteFagsakerEnSøker = {
    relaterteSøkere: [
      { søkerIdent: '17499944012', søkerNavn: 'SJØLØVE ANINE', saksnummer: '5YD0i', åpenBehandling: true },
    ],
  };

  const relaterteFagsakerFlereSøkere = {
    relaterteSøkere: [
      { søkerIdent: '12345678910', søkerNavn: 'Sjøløve Anine', saksnummer: '5YD0i', åpenBehandling: true },
      { søkerIdent: '10987654321', søkerNavn: 'Kreps Svein', saksnummer: '5YD1W', åpenBehandling: true },
    ],
  };

  it('skal vise relatert søker dersom bare én relatert søker', () => {
    render(<RelatertFagsak relaterteFagsaker={relaterteFagsakerEnSøker} />);
    const { søkerNavn } = relaterteFagsakerEnSøker.relaterteSøkere[0];
    expect(screen.getByText(søkerNavn)).toBeInTheDocument();
  });

  it('skal vise select dersom flere relaterte søkere', () => {
    render(<RelatertFagsak relaterteFagsaker={relaterteFagsakerFlereSøkere} />);
    expect(screen.getByLabelText('Velg relatert søker')).toBeInTheDocument();
    expect(screen.getByText('Åpne sak')).toBeInTheDocument();
  });
});
