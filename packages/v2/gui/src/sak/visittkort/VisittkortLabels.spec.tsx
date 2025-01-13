import { render, screen } from '@testing-library/react';
import VisittkortLabels from './VisittkortLabels';
import type { Personopplysninger } from './types/Personopplysninger';
import diskresjonskodeType from './types/diskresjonskodeType';

describe('<VisittkortLabels>', () => {
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

  it('skal ikke vise noen etiketter', () => {
    const { container } = render(<VisittkortLabels personopplysninger={personopplysningerSoker} />);
    expect(container.getElementsByClassName('navds-tag').length).toBe(0);
  });

  it('skal vise etikett for dødsdato', () => {
    render(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          dodsdato: '2019-01-01',
        }}
      />,
    );
    expect(screen.getByLabelText('Personen er død')).toBeInTheDocument();
  });

  it('skal vise etikett for kode 6', () => {
    render(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          diskresjonskode: diskresjonskodeType.KODE6,
        }}
      />,
    );

    expect(screen.getByLabelText('Personen har diskresjonsmerking kode 6')).toBeInTheDocument();
  });

  it('skal vise etikett for kode 7', () => {
    render(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          diskresjonskode: diskresjonskodeType.KODE7,
        }}
      />,
    );
    expect(screen.getByLabelText('Personen har diskresjonsmerking kode 7')).toBeInTheDocument();
  });

  it('skal vise etikett for verge', () => {
    render(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          harVerge: true,
        }}
      />,
    );
    expect(screen.getByLabelText('Personen har verge')).toBeInTheDocument();
  });

  it('skal vise etikett for søker under 18', () => {
    render(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          fodselsdato: '2019-01-01',
        }}
      />,
    );
    expect(screen.getByLabelText('Personen er under 18 år')).toBeInTheDocument();
  });
});
