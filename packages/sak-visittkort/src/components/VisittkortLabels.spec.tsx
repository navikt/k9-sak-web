import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { renderWithIntl, screen } from '@fpsak-frontend/utils-test/test-utils';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import VisittkortLabels from './VisittkortLabels';

describe('<VisittkortLabels>', () => {
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

  it('skal ikke vise noen etiketter', () => {
    const { container } = renderWithIntl(<VisittkortLabels personopplysninger={personopplysningerSoker} />, {
      messages,
    });
    expect(container.getElementsByClassName('tooltip').length).toBe(0);
  });

  it('skal vise etikett for dødsdato', () => {
    renderWithIntl(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          dodsdato: '2019-01-01',
        }}
      />,
      { messages },
    );
    expect(screen.getByText('Personen er død')).toBeInTheDocument();
  });

  it('skal vise etikett for kode 6', () => {
    renderWithIntl(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          diskresjonskode: {
            kode: diskresjonskodeType.KODE6,
            kodeverk: '',
          },
        }}
      />,
      { messages },
    );

    expect(screen.getByText('Personen har diskresjonsmerking kode 6')).toBeInTheDocument();
  });

  it('skal vise etikett for kode 7', () => {
    renderWithIntl(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          diskresjonskode: {
            kode: diskresjonskodeType.KODE7,
            kodeverk: '',
          },
        }}
      />,
      { messages },
    );
    expect(screen.getByText('Personen har diskresjonsmerking kode 7')).toBeInTheDocument();
  });

  it('skal vise etikett for verge', () => {
    renderWithIntl(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          harVerge: true,
        }}
      />,
      { messages },
    );
    expect(screen.getByText('Personen har verge')).toBeInTheDocument();
  });

  it('skal vise etikett for søker under 18', () => {
    renderWithIntl(
      <VisittkortLabels
        personopplysninger={{
          ...personopplysningerSoker,
          fodselsdato: '2019-01-01',
        }}
      />,
      { messages },
    );
    expect(screen.getByText('Personen er under 18 år')).toBeInTheDocument();
  });
});
