import { render, screen } from '@testing-library/react';
import RelatertFagsak from './RelatertFagsak';

describe('<RelatertFagsak>', () => {
  const relaterteFagsakerFlereSøkere = {
    relaterteSøkere: [
      { søkerIdent: '12345678910', søkerNavn: 'Sjøløve Anine', saksnummer: '5YD0i', åpenBehandling: true },
      { søkerIdent: '10987654321', søkerNavn: 'Kreps Svein', saksnummer: '5YD1W', åpenBehandling: true },
    ],
  };

  it('skal vise relatert søker dersom bare én relatert søker', () => {
    const søkerNavn = 'SJØLØVE ANINE';
    const relaterteFagsakerEnSøker = {
      relaterteSøkere: [{ søkerIdent: '17499944012', søkerNavn, saksnummer: '5YD0i', åpenBehandling: true }],
    };
    render(<RelatertFagsak relaterteFagsaker={relaterteFagsakerEnSøker} />);
    expect(screen.getByText(søkerNavn)).toBeInTheDocument();
  });

  it('skal vise select dersom flere relaterte søkere', () => {
    render(<RelatertFagsak relaterteFagsaker={relaterteFagsakerFlereSøkere} />);
    expect(screen.getByLabelText('Velg relatert søker')).toBeInTheDocument();
    expect(screen.getByText('Åpne sak')).toBeInTheDocument();
  });
});
