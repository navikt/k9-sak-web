import React from 'react';
import { PersonCard, Gender, EmptyPersonCard } from '@navikt/nap-person-card';

import { FlexContainer } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import shallowWithIntl from '../../i18n/index';
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

  const personopplysningerAnnenPart = {
    navBrukerKjonn: {
      kode: navBrukerKjonn.MANN,
      kodeverk: 'NAV_BRUKER_KJONN',
    },
    statsborgerskap: {
      kode: 'NORSK',
      kodeverk: 'STATSBORGERSKAP',
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
    aktoerId: '23rwerfwegwerg',
    navn: 'Tusse Trolls Gasse Avle Sønvis Eggert Offer Tønne Sjønning',
    adresser: [
      {
        adresseType: {
          kode: opplysningAdresseType.BOSTEDSADRESSE,
          kodeverk: 'ADRESSE_TYPE',
        },
        adresselinje1: 'Oslo',
      },
    ],
    fnr: '1234567',
    region: {
      kode: region.NORDEN,
      kodeverk: 'REGION',
    },
    barn: [],
  };

  it('skal vise enkelt visittkort når en ikke har personopplysninger', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel fagsakPerson={fagsakPerson} alleKodeverk={{}} sprakkode={{ kode: 'NN', kodeverk: '' }} />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).toHaveLength(1);
    expect(visittkort.prop('name')).toEqual(fagsakPerson.navn);
    expect(visittkort.prop('fodselsnummer')).toEqual(fagsakPerson.personnummer);
    expect(visittkort.prop('gender')).toEqual(Gender.female);
  });

  it('skal vise visittkort når en har harTilbakekrevingVerge', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
        harTilbakekrevingVerge
      />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).toHaveLength(1);
    expect(visittkort.prop('name')).toEqual(fagsakPerson.navn);
    expect(visittkort.prop('fodselsnummer')).toEqual(fagsakPerson.personnummer);
    expect(visittkort.prop('gender')).toEqual(Gender.female);
  });

  it('skal vise visittkort når en har personopplysninger', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
      />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(1);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).toHaveLength(1);
    expect(visittkort.prop('name')).toEqual(personopplysningerSoker.navn);
    expect(visittkort.prop('fodselsnummer')).toEqual(personopplysningerSoker.fnr);
    expect(visittkort.prop('gender')).toEqual(Gender.female);
  });

  it('skal vise visittkort for annen part', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        personopplysninger={{
          ...personopplysningerSoker,
          annenPart: personopplysningerAnnenPart,
        }}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
      />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(1);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).toHaveLength(2);
    expect(visittkort.first().prop('name')).toEqual(personopplysningerSoker.navn);
    expect(visittkort.first().prop('fodselsnummer')).toEqual(personopplysningerSoker.fnr);
    expect(visittkort.first().prop('gender')).toEqual(Gender.female);

    expect(visittkort.last().prop('name')).toEqual(personopplysningerAnnenPart.navn);
    expect(visittkort.last().prop('fodselsnummer')).toEqual(personopplysningerAnnenPart.fnr);
    expect(visittkort.last().prop('gender')).toEqual(Gender.male);
  });

  it('skal vise visittkort for ukjent søker når annen part mangler aktør-id', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        personopplysninger={{
          ...personopplysningerSoker,
          annenPart: {
            ...personopplysningerAnnenPart,
            aktoerId: undefined,
          },
        }}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
      />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(1);
    expect(wrapper.find(PersonCard)).toHaveLength(1);
    const tomtVisittkort = wrapper.find(EmptyPersonCard);
    expect(tomtVisittkort).toHaveLength(1);
    expect(tomtVisittkort.prop('namePlaceholder')).toEqual('Ukjent navn, mangler norsk id-nr');
  });
});
