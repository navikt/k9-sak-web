import React from 'react';

import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import VisittkortSakIndex from './VisittkortSakIndex';

export default {
  title: 'sak/sak-visittkort',
  component: VisittkortSakIndex,
};

const fagsakPerson = {
  erDod: false,
  navn: 'Espen Utvikler',
  alder: 41,
  personnummer: '1234567',
  erKvinne: false,
  personstatusType: {
    kode: personstatusType.BOSATT,
    kodeverk: 'PERSONSTATUS_TYPE',
  },
};

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

const personopplysningerAnnenPart = {
  navBrukerKjonn: {
    kode: navBrukerKjonn.MANN,
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

export const visVisittkortNårEnHarBegrensetMedInformasjon = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    alleKodeverk={alleKodeverk as any}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
  />
);

export const visVisittkortNårEnHarPersonopplysninger = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    personopplysninger={personopplysningerSoker}
    alleKodeverk={alleKodeverk as any}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
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
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
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
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
  />
);

export const visVisittkortNårEnHarEnRelatertFagsak = () => (
  <VisittkortSakIndex
    fagsakPerson={fagsakPerson}
    personopplysninger={personopplysningerSoker}
    alleKodeverk={alleKodeverk as any}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
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
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
    relaterteFagsaker={{
      relaterteSøkere: [
        { søkerIdent: '12345678910', søkerNavn: 'Sjøløve Anine', saksnummer: '5YD0i', åpenBehandling: true },
        { søkerIdent: '10987654321', søkerNavn: 'Kreps Svein', saksnummer: '5YD1W', åpenBehandling: true },
      ],
    }}
  />
);
