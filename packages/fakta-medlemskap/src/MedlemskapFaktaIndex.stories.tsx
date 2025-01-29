import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { action } from '@storybook/addon-actions';
import MedlemskapFaktaIndex from './MedlemskapFaktaIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
  behandlingPaaVent: false,
  status: behandlingStatus.OPPRETTET,
};

const soknad = {
  oppgittFordeling: {
    startDatoForPermisjon: '2019-01-01',
  },
  oppgittTilknytning: {
    utlandsopphold: [
      {
        landNavn: 'SVERIGE',
        fom: '2010-01-01',
        tom: '2011-01-01',
      },
    ],
  },
};

const arbeidsforhold = [
  {
    arbeidsgiverReferanse: '12345678',
    kilde: {
      kode: '-',
    },
  },
];
const medlemskap = {
  inntekt: [
    {
      navn: 'MYGG ROBUST',
      utbetaler: '973861778',
      fom: '2018-09-01',
      tom: '2018-09-30',
      ytelse: false,
      belop: 35000,
    },
    {
      navn: 'MYGG ROBUST',
      utbetaler: '973861778',
      fom: '2019-02-01',
      tom: '2019-02-28',
      ytelse: false,
      belop: 35000,
    },
  ],
  medlemskapPerioder: [
    {
      fom: '2019-01-01',
      tom: '2021-10-13',
      medlemskapType: {
        kode: 'AVKLARES',
        kodeverk: 'MEDLEMSKAP_TYPE',
      },
      dekningType: {
        kode: 'OPPHOR',
        kodeverk: 'MEDLEMSKAP_DEKNING',
      },
      kildeType: {
        kode: 'FS22',
        kodeverk: 'MEDLEMSKAP_KILDE',
      },
      beslutningsdato: null,
    },
  ],
  perioder: [
    {
      vurderingsdato: '2019-11-07',
      personopplysninger: {
        fnr: null,
        aktoerId: '1615078487209',
        diskresjonskode: null,
        nummer: null,
        navBrukerKjonn: {
          kode: 'K',
          kodeverk: 'BRUKER_KJOENN',
        },
        statsborgerskap: {
          kode: 'NOR',
          kodeverk: 'LANDKODER',
          navn: 'Norge',
        },
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
        personstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        sivilstand: {
          kode: 'UGIF',
          kodeverk: 'SIVILSTAND_TYPE',
        },
        navn: 'Mygg Robust',
        dodsdato: null,
        fodselsdato: '1966-08-02',
        adresser: [
          {
            adresseType: {
              kode: 'BOSTEDSADRESSE',
              kodeverk: 'ADRESSE_TYPE',
            },
            mottakerNavn: 'Mygg Robust',
            adresselinje1: 'Skogvegen 3',
            adresselinje2: null,
            adresselinje3: null,
            postNummer: '4353',
            poststed: 'Klepp Stasjon',
            land: 'NOR',
          },
        ],
        region: {
          kode: 'NORDEN',
          kodeverk: 'REGION',
        },
        annenPart: null,
        ektefelle: null,
        barn: [],
        barnSoktFor: [],
        barnFraTpsRelatertTilSoknad: [],
        harVerge: false,
      },
      aksjonspunkter: ['5021'],
      årsaker: ['SKJÆRINGSTIDSPUNKT'],
      oppholdsrettVurdering: null,
      erEosBorger: null,
      lovligOppholdVurdering: null,
      bosattVurdering: null,
      medlemskapManuellVurderingType: null,
      begrunnelse: null,
    },
    {
      vurderingsdato: '2018-11-07',
      personopplysninger: {
        fnr: null,
        aktoerId: '1615078487209',
        diskresjonskode: null,
        nummer: null,
        navBrukerKjonn: {
          kode: 'K',
          kodeverk: 'BRUKER_KJOENN',
        },
        statsborgerskap: {
          kode: 'NOR',
          kodeverk: 'LANDKODER',
          navn: 'Norge',
        },
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
        personstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        sivilstand: {
          kode: 'UGIF',
          kodeverk: 'SIVILSTAND_TYPE',
        },
        navn: 'Mygg Robust',
        dodsdato: null,
        fodselsdato: '1966-08-02',
        adresser: [],
        region: {
          kode: 'NORDEN',
          kodeverk: 'REGION',
        },
        annenPart: null,
        ektefelle: null,
        barn: [],
        barnSoktFor: [],
        barnFraTpsRelatertTilSoknad: [],
        harVerge: false,
      },
      aksjonspunkter: ['5021'],
      årsaker: ['SKJÆRINGSTIDSPUNKT'],
      oppholdsrettVurdering: null,
      erEosBorger: null,
      lovligOppholdVurdering: null,
      bosattVurdering: null,
      medlemskapManuellVurderingType: null,
      begrunnelse: null,
    },
  ],
};

const periodeMed5020 = {
  vurderingsdato: '2018-11-07',
  personopplysninger: {
    fnr: null,
    aktoerId: '1615078487209',
    diskresjonskode: null,
    nummer: null,
    navBrukerKjonn: {
      kode: 'K',
      kodeverk: 'BRUKER_KJOENN',
    },
    statsborgerskap: {
      kode: 'NOR',
      kodeverk: 'LANDKODER',
      navn: 'Norge',
    },
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
    personstatus: {
      kode: 'BOSA',
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    sivilstand: {
      kode: 'UGIF',
      kodeverk: 'SIVILSTAND_TYPE',
    },
    navn: 'Mygg Robust',
    dodsdato: null,
    fodselsdato: '1966-08-02',
    adresser: [],
    region: {
      kode: 'NORDEN',
      kodeverk: 'REGION',
    },
    annenPart: null,
    ektefelle: null,
    barn: [],
    barnSoktFor: [],
    barnFraTpsRelatertTilSoknad: [],
    harVerge: false,
  },
  aksjonspunkter: ['5020'],
  årsaker: ['SKJÆRINGSTIDSPUNKT'],
  oppholdsrettVurdering: null,
  erEosBorger: null,
  lovligOppholdVurdering: null,
  bosattVurdering: null,
  medlemskapManuellVurderingType: null,
  begrunnelse: null,
};

const medlemskapAp5020 = { ...medlemskap, perioder: [periodeMed5020] };

const fagsakPerson = {};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-medlemskap',
  component: MedlemskapFaktaIndex,
};

export const VisAksjonspunktForAvklaringOmBrukerErBosatt = args => (
  <MedlemskapFaktaIndex
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
    ]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    {...args}
  />
);

VisAksjonspunktForAvklaringOmBrukerErBosatt.args = {
  behandling,
  medlemskap: medlemskapAp5020,
  soknad,
  arbeidsforhold,
  fagsakPerson,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: merknaderFraBeslutter,
  },
  isForeldrepengerFagsak: true,
  readOnly: false,
  readOnlyBehandling: false,
  harApneAksjonspunkter: true,
  submittable: true,
};

export const VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter = args => (
  <MedlemskapFaktaIndex
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
    ]}
    alleKodeverk={alleKodeverk}
    submitCallback={args?.submitCallback || action('button-click')}
    {...args}
  />
);

VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter.args = {
  behandling,
  medlemskap,
  soknad,
  arbeidsforhold,
  fagsakPerson,
  isForeldrepengerFagsak: true,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: merknaderFraBeslutter,
    [aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP]: merknaderFraBeslutter,
    [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE]: merknaderFraBeslutter,
    [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: merknaderFraBeslutter,
  },
  readOnly: false,
  readOnlyBehandling: false,
  harApneAksjonspunkter: true,
  submittable: true,
};

export const VisPanelUtenAksjonspunkt = args => (
  <MedlemskapFaktaIndex
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    {...args}
  />
);

VisPanelUtenAksjonspunkt.args = {
  behandling,
  medlemskap,
  soknad,
  arbeidsforhold,
  fagsakPerson,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN]: merknaderFraBeslutter,
  },
  isForeldrepengerFagsak: true,
  readOnly: true,
  readOnlyBehandling: false,
  harApneAksjonspunkter: false,
  submittable: false,
};

export const VisPanelUtenPerioder = args => (
  <MedlemskapFaktaIndex
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    {...args}
  />
);

VisPanelUtenPerioder.args = {
  behandling: {
    ansvarligSaksbehandler: 'Z994145',
    behandlendeEnhetId: '4487',
    behandlendeEnhetNavn: 'NAV AY sykdom i familien',
    behandlingÅrsaker: [
      {
        erAutomatiskRevurdering: false,
        behandlingArsakType: {
          kode: 'RE_ANNEN_SAK',
          kodeverk: 'BEHANDLING_AARSAK',
        },
        manueltOpprettet: false,
      },
    ],
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingsfristTid: '2024-10-09',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: {
        kode: 'INNVILGET',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: {
              fom: '2024-06-03',
              tom: '2024-08-28',
            },
            avslagsårsak: null,
            utfall: {
              kode: '-',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
          },
        ],
      },
    },
    behandlingResultatType: {
      kode: 'INNVILGET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
    },
    endret: '2024-08-28T13:38:46.309',
    endretAvBrukernavn: 'k9-sak',
    erPaaVent: false,
    fagsakId: 1346602,
    sakstype: {
      kode: 'PSB',
      kodeverk: 'FAGSAK_YTELSE',
    },
    førsteÅrsak: {
      erAutomatiskRevurdering: false,
      behandlingArsakType: {
        kode: 'RE_ANNEN_SAK',
        kodeverk: 'BEHANDLING_AARSAK',
      },
      manueltOpprettet: false,
    },
    gjeldendeVedtak: false,
    id: 1353953,
    links: [],
    opprettet: '2024-08-28T13:19:43',
    sprakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    status: {
      kode: 'UTRED',
      kodeverk: 'BEHANDLING_STATUS',
    },
    stegTilstand: {
      stegType: {
        kode: 'FORVEDSTEG',
        kodeverk: 'BEHANDLING_STEG_TYPE',
      },
      stegStatus: {
        kode: 'UTGANG',
        kodeverk: 'BEHANDLING_STEG_STATUS',
      },
      tidsstempel: '2024-08-28T13:38:46.309+02:00',
    },
    toTrinnsBehandling: true,
    type: {
      kode: 'BT-002',
      kodeverk: 'BEHANDLING_TYPE',
    },
    uuid: 'd0e8071b-f54d-48b4-9a64-b7eaaa7aefcf',
    behandlingHenlagt: false,
    versjon: 234,
  },
  medlemskap: {
    medlemskapPerioder: [],
    perioder: [],
    personopplysninger: {
      '2024-06-03': {
        aktoerId: '2471000012451',
        diskresjonskode: null,
        fnr: null,
        adresser: [
          {
            adresselinje1: 'Skippergata 81',
            adresselinje2: null,
            adresselinje3: null,
            adresseType: {
              kode: 'BOSTEDSADRESSE',
              kodeverk: 'ADRESSE_TYPE',
            },
            land: 'NOR',
            mottakerNavn: 'Familie Ordknapp',
            postNummer: '4614',
            poststed: null,
          },
        ],
        pleietrengendePart: {
          aktoerId: '2067342699855',
          diskresjonskode: null,
          fnr: null,
          adresser: [
            {
              adresselinje1: 'Skippergata 81',
              adresselinje2: null,
              adresselinje3: null,
              adresseType: {
                kode: 'BOSTEDSADRESSE',
                kodeverk: 'ADRESSE_TYPE',
              },
              land: 'NOR',
              mottakerNavn: 'Pusekatt Ökänd',
              postNummer: '4614',
              poststed: null,
            },
          ],
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
          dodsdato: null,
          ektefelle: null,
          fodselsdato: '2017-10-31',
          harVerge: false,
          navBrukerKjonn: {
            kode: 'M',
            kodeverk: 'BRUKER_KJOENN',
          },
          navn: 'Pusekatt Ökänd',
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
            kodeverk: 'LANDKODER',
            navn: 'NOR',
          },
        },
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
            aktoerId: '2067342699855',
            diskresjonskode: null,
            fnr: null,
            adresser: [
              {
                adresselinje1: 'Skippergata 81',
                adresselinje2: null,
                adresselinje3: null,
                adresseType: {
                  kode: 'BOSTEDSADRESSE',
                  kodeverk: 'ADRESSE_TYPE',
                },
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
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
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: {
              kode: 'M',
              kodeverk: 'BRUKER_KJOENN',
            },
            navn: 'Pusekatt Ökänd',
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
              kodeverk: 'LANDKODER',
              navn: 'NOR',
            },
          },
        ],
        barnSoktFor: [
          {
            aktoerId: '2067342699855',
            diskresjonskode: null,
            fnr: null,
            adresser: [
              {
                adresselinje1: 'Skippergata 81',
                adresselinje2: null,
                adresselinje3: null,
                adresseType: {
                  kode: 'BOSTEDSADRESSE',
                  kodeverk: 'ADRESSE_TYPE',
                },
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
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
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: {
              kode: 'M',
              kodeverk: 'BRUKER_KJOENN',
            },
            navn: 'Pusekatt Ökänd',
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
              kodeverk: 'LANDKODER',
              navn: 'NOR',
            },
          },
        ],
        dodsdato: null,
        ektefelle: null,
        fodselsdato: '1994-03-24',
        harVerge: false,
        navBrukerKjonn: {
          kode: 'K',
          kodeverk: 'BRUKER_KJOENN',
        },
        navn: 'Familie Ordknapp',
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
          kodeverk: 'LANDKODER',
          navn: 'NOR',
        },
      },
      '2024-08-10': {
        aktoerId: '2471000012451',
        diskresjonskode: null,
        fnr: null,
        adresser: [
          {
            adresselinje1: 'Fergegata 1',
            adresselinje2: null,
            adresselinje3: null,
            adresseType: {
              kode: 'BOSTEDSADRESSE',
              kodeverk: 'ADRESSE_TYPE',
            },
            land: 'NOR',
            mottakerNavn: 'Leverpostei Kjent',
            postNummer: '4614',
            poststed: null,
          },
        ],
        pleietrengendePart: {
          aktoerId: '2067342699855',
          diskresjonskode: null,
          fnr: null,
          adresser: [
            {
              adresselinje1: 'Skippergata 81',
              adresselinje2: null,
              adresselinje3: null,
              adresseType: {
                kode: 'BOSTEDSADRESSE',
                kodeverk: 'ADRESSE_TYPE',
              },
              land: 'NOR',
              mottakerNavn: 'Pusekatt Ökänd',
              postNummer: '4614',
              poststed: null,
            },
          ],
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
          dodsdato: null,
          ektefelle: null,
          fodselsdato: '2017-10-31',
          harVerge: false,
          navBrukerKjonn: {
            kode: 'M',
            kodeverk: 'BRUKER_KJOENN',
          },
          navn: 'Pusekatt Ökänd',
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
            kodeverk: 'LANDKODER',
            navn: 'NOR',
          },
        },
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
            aktoerId: '2067342699855',
            diskresjonskode: null,
            fnr: null,
            adresser: [
              {
                adresselinje1: 'Skippergata 81',
                adresselinje2: null,
                adresselinje3: null,
                adresseType: {
                  kode: 'BOSTEDSADRESSE',
                  kodeverk: 'ADRESSE_TYPE',
                },
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
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
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: {
              kode: 'M',
              kodeverk: 'BRUKER_KJOENN',
            },
            navn: 'Pusekatt Ökänd',
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
              kodeverk: 'LANDKODER',
              navn: 'NOR',
            },
          },
        ],
        barnSoktFor: [
          {
            aktoerId: '2067342699855',
            diskresjonskode: null,
            fnr: null,
            adresser: [
              {
                adresselinje1: 'Skippergata 81',
                adresselinje2: null,
                adresselinje3: null,
                adresseType: {
                  kode: 'BOSTEDSADRESSE',
                  kodeverk: 'ADRESSE_TYPE',
                },
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
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
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: {
              kode: 'M',
              kodeverk: 'BRUKER_KJOENN',
            },
            navn: 'Pusekatt Ökänd',
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
              kodeverk: 'LANDKODER',
              navn: 'NOR',
            },
          },
        ],
        dodsdato: null,
        ektefelle: null,
        fodselsdato: '1994-03-24',
        harVerge: false,
        navBrukerKjonn: {
          kode: 'K',
          kodeverk: 'BRUKER_KJOENN',
        },
        navn: 'Familie Ordknapp',
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
          kodeverk: 'LANDKODER',
          navn: 'NOR',
        },
      },
    },
  },
  soknad: {
    begrunnelseForSenInnsending: null,
    manglendeVedlegg: [
      {
        arbeidsgiver: {
          aktørId: null,
          fødselsdato: null,
          navn: 'SNILL TORPEDO',
          organisasjonsNummer: '967170232',
        },
        brukerHarSagtAtIkkeKommer: false,
        dokumentType: {
          kode: 'INNTEKTSMELDING',
          kodeverk: 'DOKUMENT_TYPE_ID',
        },
      },
    ],
    angittePersoner: [],
    mottattDato: '2024-08-28',
    oppgittStartdato: '2024-06-03',
    oppgittTilknytning: {
      utlandsopphold: [
        {
          landNavn: 'SVERIGE',
          fom: '2010-01-01',
          tom: '2011-01-01',
        },
      ],
    },
    soknadsdato: '2024-06-03',
    spraakkode: {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
    },
    tilleggsopplysninger: null,
    søknadsperiode: {
      fom: '2024-06-03',
      tom: '2024-08-28',
    },
  },
  fagsakPerson,
  alleMerknaderFraBeslutter: {},
  readOnly: false,
  submittable: true,
};
