import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { Aksjonspunkt, Behandling, Fagsak, FagsakPerson, Vilkar, Rammevedtak } from '@k9-sak-web/types';
import UtvidetRettSoknad from '../../types/UtvidetRettSoknad';

const utvidetRettTestData = {
  aksjonspunkter: [
    {
      definisjon: { kode: aksjonspunktCodes.OMSORGEN_FOR, kodeverk: 'test' },
      status: { kode: 'UTFO', kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
    {
      definisjon: { kode: aksjonspunktCodes.UTVIDET_RETT, kodeverk: 'test' },
      status: { kode: 'UTFO', kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
  ] as Aksjonspunkt[],
  arbeidsgiverOpplysningerPerId: {
    123: {
      erPrivatPerson: false,
      identifikator: 'testId',
      navn: 'testNavn',
    },
  },
  behandling: {
    id: 1,
    versjon: 2,
    status: { kode: behandlingStatus.AVSLUTTET, kodeverk: 'test' },
    type: { kode: 'BT-002', kodeverk: 'test' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  } as Behandling,
  fagsak: {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak,
  fagsakPerson: {
    alder: 30,
    personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  } as FagsakPerson,
  rammevedtak: [
    {
      type: 'OverføringFår',
      vedtatt: '2020-01-01',
      lengde: 'PT480H',
      gyldigFraOgMed: '2020-01-01',
      gyldigTilOgMed: '2022-02-04',
      avsender: '02099541043',
    },
  ] as Rammevedtak[],
  rettigheter: {
    writeAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
    kanOverstyreAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
  },
  vilkar: [] as Vilkar[],
  soknad: {
    begrunnelseForSenInnsending: null,
    manglendeVedlegg: [],
    angittePersoner: [
      {
        navn: 'DUCK DOLE',
        fødselsdato: '2019-02-18',
        rolle: 'BARN',
        aktørId: '9907481888926',
        personIdent: '07481888926',
      },
    ],
    mottattDato: '2021-02-18',
    oppgittStartdato: '2021-02-18',
    oppgittTilknytning: null,
    soknadsdato: '2021-02-18',
    spraakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    tilleggsopplysninger: null,
    søknadsperiode: {
      fom: '2021-02-18',
      tom: '9999-12-31',
    },
  } as UtvidetRettSoknad,
  personopplysninger: {
    aktoerId: '9930518028614',
    diskresjonskode: {
      kode: 'UDEF',
      kodeverk: 'DISKRESJONSKODE',
    },
    fnr: '30518028614',
    adresser: [
      {
        adresselinje1: 'Fjordlandet 10 B',
        adresselinje2: null,
        adresselinje3: null,
        adresseType: {
          kode: 'BOSTEDSADRESSE',
          kodeverk: 'ADRESSE_TYPE',
        },
        land: 'NOR',
        mottakerNavn: 'Skravlepapegøye Gunnhild',
        postNummer: '2500',
        poststed: null,
      },
    ],
    annenPart: null,
    avklartPersonstatus: {
      orginalPersonstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      overstyrtPersonstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    },
    barn: [
      {
        aktoerId: '9930482094089',
        diskresjonskode: {
          kode: 'UDEF',
          kodeverk: 'DISKRESJONSKODE',
        },
        fnr: '30482094089',
        adresser: [
          {
            adresselinje1: 'Fjordlandet 10 B',
            adresselinje2: null,
            adresselinje3: null,
            adresseType: {
              kode: 'BOSTEDSADRESSE',
              kodeverk: 'ADRESSE_TYPE',
            },
            land: 'NOR',
            mottakerNavn: 'Duck Dole',
            postNummer: '2500',
            poststed: null,
          },
        ],
        annenPart: null,
        avklartPersonstatus: {
          orginalPersonstatus: {
            kode: 'BOSA',
            kodeverk: 'PERSONSTATUS_TYPE',
          },
          overstyrtPersonstatus: {
            kode: 'BOSA',
            kodeverk: 'PERSONSTATUS_TYPE',
          },
        },
        barn: [],
        barnFraTpsRelatertTilSoknad: [],
        barnSoktFor: [],
        dodsdato: null,
        ektefelle: null,
        fodselsdato: '2021-02-02',
        harVerge: false,
        navBrukerKjonn: {
          kode: 'K',
          kodeverk: 'BRUKER_KJOENN',
        },
        navn: 'Duck Dole',
        nummer: null,
        personstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        region: {
          kode: 'NORDEN',
          kodeverk: 'REGION',
        },
        sivilstand: {
          kode: 'UGIF',
          kodeverk: 'SIVILSTAND_TYPE',
        },
        statsborgerskap: {
          kode: 'NOR',
          navn: 'NOR',
          kodeverk: 'LANDKODER',
        },
      },
    ],
    barnFraTpsRelatertTilSoknad: [],
    barnSoktFor: [],
    dodsdato: null,
    ektefelle: {
      aktoerId: '9913459959631',
      diskresjonskode: {
        kode: 'UDEF',
        kodeverk: 'DISKRESJONSKODE',
      },
      fnr: '13459959631',
      adresser: [
        {
          adresselinje1: 'Fjordlandet 10 B',
          adresselinje2: null,
          adresselinje3: null,
          adresseType: {
            kode: 'BOSTEDSADRESSE',
            kodeverk: 'ADRESSE_TYPE',
          },
          land: 'NOR',
          mottakerNavn: 'Terrier Bernt',
          postNummer: '2500',
          poststed: null,
        },
      ],
      annenPart: null,
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
      },
      barn: [],
      barnFraTpsRelatertTilSoknad: [],
      barnSoktFor: [],
      dodsdato: null,
      ektefelle: null,
      fodselsdato: '1971-02-04',
      harVerge: false,
      navBrukerKjonn: {
        kode: 'M',
        kodeverk: 'BRUKER_KJOENN',
      },
      navn: 'Terrier Bernt',
      nummer: null,
      personstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      region: {
        kode: 'NORDEN',
        kodeverk: 'REGION',
      },
      sivilstand: {
        kode: 'UGIF',
        kodeverk: 'SIVILSTAND_TYPE',
      },
      statsborgerskap: {
        kode: 'NOR',
        navn: 'NOR',
        kodeverk: 'LANDKODER',
      },
    },
    fodselsdato: '1971-02-04',
    harVerge: false,
    navBrukerKjonn: {
      kode: 'K',
      kodeverk: 'BRUKER_KJOENN',
    },
    navn: 'Skravlepapegøye Gunnhild',
    nummer: null,
    personstatus: {
      kode: 'BOSA',
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    region: {
      kode: 'NORDEN',
      kodeverk: 'REGION',
    },
    sivilstand: {
      kode: 'GIFT',
      kodeverk: 'SIVILSTAND_TYPE',
    },
    statsborgerskap: {
      kode: 'NOR',
      navn: 'NOR',
      kodeverk: 'LANDKODER',
    },
  },
  arbeidsgiverOpplysninger: {},
};

export default utvidetRettTestData;
