import React from 'react';

import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { renderWithIntl, screen } from '@fpsak-frontend/utils-test/test-utils';

import VisittkortPanel from './VisittkortPanel';

import messages from '../../i18n/nb_NO.json';

describe('<VisittkortPanel>', () => {
  const fagsakPerson = {
    erDod: false,
    navn: 'Olga Utvikler',
    alder: 41,
    personnummer: '1234567',
    erKvinne: true,
    personstatusType: personstatusType.BOSATT,
  };

  const personopplysningerSoker = {
    fodselsdato: '1990-01-01',
    navBrukerKjonn: navBrukerKjonn.KVINNE,
    statsborgerskap: 'NORSK',
    avklartPersonstatus: {
      orginalPersonstatus: personstatusType.BOSATT,
      overstyrtPersonstatus: personstatusType.BOSATT,
    },
    personstatus: personstatusType.BOSATT,
    diskresjonskode: diskresjonskodeType.KLIENT_ADRESSE,
    sivilstand: sivilstandType.SAMBOER,
    aktoerId: '24sedfs32',
    navn: 'Olga Utvikler',
    adresser: [
      {
        adresseType: opplysningAdresseType.BOSTEDSADRESSE,
        adresselinje1: 'Oslo',
      },
    ],
    fnr: '98773895',
    region: region.NORDEN,
    barn: [],
  };

  it('skal vise enkelt visittkort når en ikke har personopplysninger', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);

    renderWithIntl(<VisittkortPanel fagsakPerson={fagsakPerson} sprakkode="NN" relaterteFagsaker={null} />, {
      messages,
    });

    expect(screen.getByText(fagsakPerson.navn)).toBeInTheDocument();
    expect(screen.getByText(fagsakPerson.personnummer)).toBeInTheDocument();
    expect(screen.getByText('Kvinne')).toBeInTheDocument();
  });

  it('skal vise visittkort når en har harTilbakekrevingVerge', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);

    renderWithIntl(
      <VisittkortPanel fagsakPerson={fagsakPerson} sprakkode="NN" harTilbakekrevingVerge relaterteFagsaker={null} />,
      { messages },
    );
    expect(screen.getByText('Personen har verge')).toBeInTheDocument();
    expect(screen.getByText('Verge')).toBeInTheDocument();
  });

  it('skal vise visittkort når en har personopplysninger', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);

    renderWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        personopplysninger={personopplysningerSoker}
        sprakkode="NN"
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
