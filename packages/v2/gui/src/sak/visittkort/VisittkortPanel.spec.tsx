import { render, screen } from '@testing-library/react';
import VisittkortPanel from './VisittkortPanel';
import type { Personopplysninger } from './types/Personopplysninger';

describe('<VisittkortPanel>', () => {
  const fagsakPerson = {
    erDod: false,
    navn: 'Olga Utvikler',
    alder: 41,
    personnummer: '1234567',
    erKvinne: true,
    personstatusType: 'BOSA',
  };

  const personopplysningerSoker: Personopplysninger = {
    fodselsdato: '1990-01-01',
    navBrukerKjonn: 'KVINNE', // NAV_BRUKER_KJONN
    avklartPersonstatus: {
      orginalPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
      overstyrtPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
    },
    personstatus: 'BOSA', // PERSONSTATUS_TYPE
    diskresjonskode: 'KLIENT_ADRESSE', // DISKRESJONSKODE_TYPE
    sivilstand: 'SAMB', // SIVILSTAND_TYPE
    aktoerId: '24sedfs32',
    navn: 'Olga Utvikler',
    adresser: [
      {
        adresseType: 'BOSTEDSADRESSE', // ADRESSE_TYPE
        adresselinje1: 'Oslo',
        land: 'Norge',
      },
    ],
    fnr: '98773895',
    region: 'NORDEN', // REGION
    barnSoktFor: [],
    harVerge: false,
  };

  it('skal vise enkelt visittkort når en ikke har personopplysninger', () => {
    render(<VisittkortPanel fagsakPerson={fagsakPerson} sprakkode="NN" />);

    expect(screen.getByText(fagsakPerson.navn)).toBeInTheDocument();
    expect(screen.getByText('123456 7')).toBeInTheDocument();
  });

  it('skal vise visittkort når en har harTilbakekrevingVerge', () => {
    render(<VisittkortPanel fagsakPerson={fagsakPerson} sprakkode="NN" harTilbakekrevingVerge />);
    expect(screen.getByLabelText('Personen har verge')).toBeInTheDocument();
    expect(screen.getByText('Verge')).toBeInTheDocument();
  });

  it('skal vise visittkort når en har personopplysninger', () => {
    render(<VisittkortPanel fagsakPerson={fagsakPerson} personopplysninger={personopplysningerSoker} sprakkode="NN" />);

    expect(screen.getByText(personopplysningerSoker.navn)).toBeInTheDocument();
    expect(screen.getByText('987738 95')).toBeInTheDocument();
    expect(screen.getByText(fagsakPerson.navn)).toBeInTheDocument();
  });
});
