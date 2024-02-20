import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { renderWithIntl, screen } from '@fpsak-frontend/utils-test/test-utils';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import VisittkortPanel from './VisittkortPanel';

describe('<VisittkortPanel>', () => {
  const fagsakPerson = {
    erDod: false,
    navn: 'Olga Utvikler',
    alder: 41,
    personnummer: '1234567',
    erKvinne: true,
    personstatusType: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  };

  const personopplysningerSoker = {
    fodselsdato: '1990-01-01',
    navBrukerKjonn: {
      kode: navBrukerKjonn.KVINNE,
      kodeverk: 'NAV_BRUKER_KJONN',
    },
    statsborgerskap: {
      kode: 'NORSK',
      kodeverk: 'STATSBORGERSKAP',
      navn: 'NORSK',
    },
    avklartPersonstatus: {
      orginalPersonstatus: {
        kode: personstatusType.BOSATT,
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      overstyrtPersonstatus: {
        kode: personstatusType.BOSATT,
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    },
    personstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    diskresjonskode: {
      kode: diskresjonskodeType.KLIENT_ADRESSE,
      kodeverk: 'DISKRESJONSKODE_TYPE',
    },
    sivilstand: {
      kode: sivilstandType.SAMBOER,
      kodeverk: 'SIVILSTAND_TYPE',
    },
    aktoerId: '24sedfs32',
    navn: 'Olga Utvikler',
    adresser: [
      {
        adresseType: {
          kode: opplysningAdresseType.BOSTEDSADRESSE,
          kodeverk: 'ADRESSE_TYPE',
        },
        adresselinje1: 'Oslo',
      },
    ],
    fnr: '98773895',
    region: {
      kode: region.NORDEN,
      kodeverk: 'REGION',
    },
    barn: [],
  };

  it('skal vise enkelt visittkort når en ikke har personopplysninger', () => {
    renderWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
        relaterteFagsaker={null}
      />,
      { messages },
    );

    expect(screen.getByText(fagsakPerson.navn)).toBeInTheDocument();
    expect(screen.getByText(fagsakPerson.personnummer)).toBeInTheDocument();
    expect(screen.getByText('Kvinne')).toBeInTheDocument();
  });

  it('skal vise visittkort når en har harTilbakekrevingVerge', () => {
    renderWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
        harTilbakekrevingVerge
        relaterteFagsaker={null}
      />,
      { messages },
    );
    expect(screen.getByText('Personen har verge')).toBeInTheDocument();
    expect(screen.getByText('Verge')).toBeInTheDocument();
  });

  it('skal vise visittkort når en har personopplysninger', () => {
    renderWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
        relaterteFagsaker={null}
      />,
      { messages },
    );

    expect(screen.getByText(personopplysningerSoker.navn)).toBeInTheDocument();
    expect(screen.getByText(personopplysningerSoker.fnr)).toBeInTheDocument();
    expect(screen.getByText('Kvinne')).toBeInTheDocument();
    expect(screen.getByText(fagsakPerson.navn)).toBeInTheDocument();
  });
});
