import diskresjonskodeType from '@k9-sak-web/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@k9-sak-web/kodeverk/src/navBrukerKjonn';
import opplysningAdresseType from '@k9-sak-web/kodeverk/src/opplysningAdresseType';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import region from '@k9-sak-web/kodeverk/src/region';
import sivilstandType from '@k9-sak-web/kodeverk/src/sivilstandType';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/dom';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';

describe('<VisittkortDetaljerPopup>', () => {
  const personopplysningerSoker = {
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

  it('skal vise etiketter', () => {
    renderWithIntl(
      <VisittkortDetaljerPopup
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
      />,
      { messages },
    );
    expect(screen.getByText('Statsborgerskap')).toBeInTheDocument();
    expect(screen.getByText('Personstatus')).toBeInTheDocument();
    expect(screen.getByText('Sivilstand')).toBeInTheDocument();
    expect(screen.getByText('Foretrukket språk')).toBeInTheDocument();
  });

  it('skal vise adresser', () => {
    renderWithIntl(
      <VisittkortDetaljerPopup
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
      />,
      { messages },
    );

    expect(screen.getByText('Bostedsadresse')).toBeInTheDocument();
    expect(screen.getByText('Oslo,')).toBeInTheDocument();
  });
});
