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
          diskresjonskode: diskresjonskodeType.KODE6,
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
          diskresjonskode: diskresjonskodeType.KODE7,
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
