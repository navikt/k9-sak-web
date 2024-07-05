import React from 'react';
import { screen } from '@testing-library/dom';

import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';

import messages from '../../i18n/nb_NO.json';
import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';

describe('<VisittkortDetaljerPopup>', () => {
  const personopplysningerSoker = {
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

  it('skal vise etiketter', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntl(<VisittkortDetaljerPopup personopplysninger={personopplysningerSoker} sprakkode="NN" />, {
      messages,
    });
    expect(screen.getByText('Statsborgerskap')).toBeInTheDocument();
    expect(screen.getByText('Personstatus')).toBeInTheDocument();
    expect(screen.getByText('Sivilstand')).toBeInTheDocument();
    expect(screen.getByText('Foretrukket språk')).toBeInTheDocument();
  });

  it('skal vise adresser', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntl(<VisittkortDetaljerPopup personopplysninger={personopplysningerSoker} sprakkode="NN" />, {
      messages,
    });

    expect(screen.getByText('Bostedsadresse')).toBeInTheDocument();
    expect(screen.getByText('Oslo,')).toBeInTheDocument();
  });
});
