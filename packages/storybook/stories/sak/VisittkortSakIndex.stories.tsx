import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';

import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'sak/sak-visittkort',
  component: VisittkortSakIndex,
  decorators: [withKnobs],
};

const fagsakPerson = {
  erDod: false,
  navn: 'Espen Utvikler',
  alder: 41,
  personnummer: '1234567',
  erKvinne: false,
  personstatusType: personstatusType.BOSATT,
};

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

const personopplysningerAnnenPart = {
  navBrukerKjonn: navBrukerKjonn.MANN,
  statsborgerskap: 'NORSK',
  avklartPersonstatus: {
    orginalPersonstatus: personstatusType.BOSATT,
    overstyrtPersonstatus: personstatusType.BOSATT,
  },
  personstatus: personstatusType.BOSATT,
  diskresjonskode: diskresjonskodeType.KLIENT_ADRESSE,
  sivilstand: sivilstandType.SAMBOER,
  aktoerId: '23rwerfwegwerg',
  navn: 'Tusse Trolls Gasse Avle Sønvis Eggert Offer Tønne Sjønning',
  adresser: [
    {
      adresseType: opplysningAdresseType.BOSTEDSADRESSE,
      adresselinje1: 'Oslo',
    },
  ],
  fnr: '1234567',
  region: region.NORDEN,
  barn: [],
};

export const visVisittkortNårEnHarBegrensetMedInformasjon = () => (
  <VisittkortSakIndex fagsakPerson={fagsakPerson} alleKodeverk={alleKodeverk as any} sprakkode="NN" />
);

export const visVisittkortNårEnHarPersonopplysninger = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    personopplysninger={personopplysningerSoker}
    alleKodeverk={alleKodeverk as any}
    sprakkode="NN"
  />
);

export const visVisittkortNårEnHarPersonopplysningerForBeggeParter = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    personopplysninger={{
      ...personopplysningerSoker,
      annenPart: personopplysningerAnnenPart,
    }}
    alleKodeverk={alleKodeverk as any}
    sprakkode="NN"
  />
);

export const visVisittkortForAnnenPartDerAktørIdErUkjent = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    personopplysninger={{
      ...personopplysningerSoker,
      annenPart: {
        ...personopplysningerAnnenPart,
        aktoerId: undefined,
      },
    }}
    alleKodeverk={alleKodeverk as any}
    sprakkode="NN"
  />
);

export const visVisittkortNårEnHarEnRelatertFagsak = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    personopplysninger={personopplysningerSoker}
    alleKodeverk={alleKodeverk as any}
    sprakkode="NN"
    relaterteFagsaker={{
      relaterteSøkere: [
        { søkerIdent: '17499944012', søkerNavn: 'SJØLØVE ANINE', saksnummer: '5YD0i', åpenBehandling: true },
      ],
    }}
  />
);

export const visVisittkortNårEnHarFlereRelaterteFagsaker = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    personopplysninger={personopplysningerSoker}
    alleKodeverk={alleKodeverk as any}
    sprakkode="NN"
    relaterteFagsaker={{
      relaterteSøkere: [
        { søkerIdent: '12345678910', søkerNavn: 'Sjøløve Anine', saksnummer: '5YD0i', åpenBehandling: true },
        { søkerIdent: '10987654321', søkerNavn: 'Kreps Svein', saksnummer: '5YD1W', åpenBehandling: true },
      ],
    }}
  />
);
