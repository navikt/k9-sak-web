import React from 'react';

import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';

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
  personstatusType: personstatusType.BOSATT, // PERSONSTATUS_TYPE
};

const personopplysningerSoker = {
  navBrukerKjonn: navBrukerKjonn.KVINNE, // NAV_BRUKER_KJONN
  statsborgerskap: 'NORSK', // STATSBORGERSKAP
  avklartPersonstatus: {
    orginalPersonstatus: personstatusType.BOSATT, // 'PERSONSTATUS_TYPE
    overstyrtPersonstatus: personstatusType.BOSATT, // PERSONSTATUS_TYPE
  },
  personstatus: personstatusType.BOSATT, // PERSONSTATUS_TYPE
  diskresjonskode: diskresjonskodeType.KLIENT_ADRESSE, // DISKRESJONSKODE_TYPE
  sivilstand: sivilstandType.SAMBOER, // SIVILSTAND_TYPE
  aktoerId: '24sedfs32',
  navn: 'Olga Utvikler',
  adresser: [
    {
      adresseType: opplysningAdresseType.BOSTEDSADRESSE, // ADRESSE_TYPE
      adresselinje1: 'Oslo',
    },
  ],
  fnr: '98773895',
  region: region.NORDEN, // REGION
  barn: [],
};

const personopplysningerAnnenPart = {
  navBrukerKjonn: navBrukerKjonn.MANN, // NAV_BRUKER_KJONN
  statsborgerskap: 'NORSK', // STATSBORGERSKAP
  avklartPersonstatus: {
    orginalPersonstatus: personstatusType.BOSATT, // PERSONSTATUS_TYPE
    overstyrtPersonstatus: personstatusType.BOSATT, // PERSONSTATUS_TYPE
  },
  personstatus: personstatusType.BOSATT, // PERSONSTATUS_TYPE
  diskresjonskode: diskresjonskodeType.KLIENT_ADRESSE, // DISKRESJONSKODE_TYPE
  sivilstand: sivilstandType.SAMBOER, // SIVILSTAND_TYPE
  aktoerId: '23rwerfwegwerg',
  navn: 'Tusse Trolls Gasse Avle Sønvis Eggert Offer Tønne Sjønning',
  adresser: [
    {
      adresseType: opplysningAdresseType.BOSTEDSADRESSE, // ADRESSE_TYPE
      adresselinje1: 'Oslo',
    },
  ],
  fnr: '1234567',
  region: region.NORDEN, // REGION
  barn: [],
};

export const visVisittkortNårEnHarBegrensetMedInformasjon = () => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <VisittkortSakIndex fagsakPerson={fagsakPerson} sprakkode="NN" />
  </KodeverkProvider>
);

export const visVisittkortNårEnHarPersonopplysninger = () => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <VisittkortSakIndex fagsakPerson={fagsakPerson} personopplysninger={personopplysningerSoker} sprakkode="NN" />
  </KodeverkProvider>
);

export const visVisittkortNårEnHarPersonopplysningerForBeggeParter = () => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <VisittkortSakIndex
      fagsakPerson={fagsakPerson}
      personopplysninger={{
        ...personopplysningerSoker,
        annenPart: personopplysningerAnnenPart,
      }}
      sprakkode="NN"
    />
  </KodeverkProvider>
);

export const visVisittkortForAnnenPartDerAktørIdErUkjent = () => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <VisittkortSakIndex
      fagsakPerson={fagsakPerson}
      personopplysninger={{
        ...personopplysningerSoker,
        annenPart: {
          ...personopplysningerAnnenPart,
          aktoerId: undefined,
        },
      }}
      sprakkode="NN"
    />
  </KodeverkProvider>
);

export const visVisittkortNårEnHarEnRelatertFagsak = () => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <VisittkortSakIndex
      fagsakPerson={fagsakPerson}
      personopplysninger={personopplysningerSoker}
      sprakkode="NN"
      relaterteFagsaker={{
        relaterteSøkere: [
          { søkerIdent: '17499944012', søkerNavn: 'SJØLØVE ANINE', saksnummer: '5YD0i', åpenBehandling: true },
        ],
      }}
    />
  </KodeverkProvider>
);

export const visVisittkortNårEnHarFlereRelaterteFagsaker = () => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <VisittkortSakIndex
      fagsakPerson={fagsakPerson}
      personopplysninger={personopplysningerSoker}
      sprakkode="NN"
      relaterteFagsaker={{
        relaterteSøkere: [
          { søkerIdent: '12345678910', søkerNavn: 'Sjøløve Anine', saksnummer: '5YD0i', åpenBehandling: true },
          { søkerIdent: '10987654321', søkerNavn: 'Kreps Svein', saksnummer: '5YD1W', åpenBehandling: true },
        ],
      }}
    />
  </KodeverkProvider>
);
