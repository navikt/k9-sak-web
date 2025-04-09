import {
  AksjonspunktDtoDefinisjon,
  AksjonspunktDtoStatus,
  AvklartPersonstatusOrginalPersonstatus,
  BehandlingAksjonspunktDtoBehandlingStatus,
  BehandlingDtoStatus,
  BehandlingDtoType,
  BehandlingsresultatDtoType,
  BehandlingStegTilstandDtoStegStatus,
  BehandlingStegTilstandDtoStegType,
  BehandlingÅrsakDtoBehandlingArsakType,
  KravDokumentStatusType,
  MedlemskapPerioderDtoDekningType,
  MedlemskapPerioderDtoKildeType,
  PersonadresseDtoAdresseType,
  PersonopplysningDtoNavBrukerKjonn,
  PersonopplysningDtoRegion,
  PersonopplysningDtoSivilstand,
  VilkårResultatDtoUtfall,
} from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { action } from '@storybook/addon-actions';
import MedlemskapFaktaIndex from './MedlemskapFaktaIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
  behandlingPåVent: false,
  status: BehandlingDtoStatus.OPPRETTET,
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
    // kilde: {
    //   kode: '-',
    // },
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
      // medlemskapType: {
      //   kode: 'AVKLARES',
      //   kodeverk: 'MEDLEMSKAP_TYPE',
      // },
      dekningType: MedlemskapPerioderDtoDekningType.OPPHOR,
      kildeType: MedlemskapPerioderDtoKildeType.FS22,
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
        navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.KVINNE,
        statsborgerskap: 'NOR',
        avklartPersonstatus: {
          orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        },
        personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        navn: 'Mygg Robust',
        dodsdato: null,
        fodselsdato: '1966-08-02',
        adresser: [
          {
            adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
            mottakerNavn: 'Mygg Robust',
            adresselinje1: 'Skogvegen 3',
            adresselinje2: null,
            adresselinje3: null,
            postNummer: '4353',
            poststed: 'Klepp Stasjon',
            land: 'NOR',
          },
        ],
        region: PersonopplysningDtoRegion.NORDEN,
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
        navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.KVINNE,
        statsborgerskap: 'NOR',
        avklartPersonstatus: {
          orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        },
        personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        navn: 'Mygg Robust',
        dodsdato: null,
        fodselsdato: '1966-08-02',
        adresser: [],
        region: PersonopplysningDtoRegion.NORDEN,
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
    navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.KVINNE,
    statsborgerskap: 'NOR',
    avklartPersonstatus: {
      orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
      overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
    },
    personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
    sivilstand: PersonopplysningDtoSivilstand.UGIFT,
    navn: 'Mygg Robust',
    dodsdato: null,
    fodselsdato: '1966-08-02',
    adresser: [],
    region: PersonopplysningDtoRegion.NORDEN,
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
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT,
        status: AksjonspunktDtoStatus.OPPRETTET,
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
    [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: merknaderFraBeslutter,
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
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT,
        status: AksjonspunktDtoStatus.OPPRETTET,
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_FORTSATT_MEDLEMSKAP,
        status: AksjonspunktDtoStatus.OPPRETTET,
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
        status: AksjonspunktDtoStatus.OPPRETTET,
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: AksjonspunktDtoDefinisjon.AVKLAR_OPPHOLDSRETT,
        status: AksjonspunktDtoStatus.OPPRETTET,
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
    [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: merknaderFraBeslutter,
    [AksjonspunktDtoDefinisjon.AVKLAR_FORTSATT_MEDLEMSKAP]: merknaderFraBeslutter,
    [AksjonspunktDtoDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE]: merknaderFraBeslutter,
    [AksjonspunktDtoDefinisjon.AVKLAR_OPPHOLDSRETT]: merknaderFraBeslutter,
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
    [AksjonspunktDtoDefinisjon.AVKLAR_OM_ER_BOSATT]: merknaderFraBeslutter,
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
        behandlingArsakType: BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRING_FRA_ANNEN_OMSORGSPERSON,
        manueltOpprettet: false,
      },
    ],
    behandlingKoet: false,
    behandlingPåVent: false,
    behandlingsfristTid: '2024-10-09',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: BehandlingsresultatDtoType.INNVILGET,
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: {
              fom: '2024-06-03',
              tom: '2024-08-28',
            },
            avslagsårsak: null,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
      },
    },
    behandlingResultatType: BehandlingsresultatDtoType.INNVILGET,
    endret: '2024-08-28T13:38:46.309',
    endretAvBrukernavn: 'k9-sak',
    erPåVent: false,
    fagsakId: 1346602,
    sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
    førsteÅrsak: {
      erAutomatiskRevurdering: false,
      behandlingArsakType: BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRING_FRA_ANNEN_OMSORGSPERSON,
    },
    gjeldendeVedtak: false,
    id: 1353953,
    links: [],
    opprettet: '2024-08-28T13:19:43',
    språkkode: 'NB',
    status: BehandlingAksjonspunktDtoBehandlingStatus.UTREDES,
    stegTilstand: {
      stegType: BehandlingStegTilstandDtoStegType.FORESLÅ_VEDTAK,
      stegStatus: BehandlingStegTilstandDtoStegStatus.UTGANG,
      tidsstempel: '2024-08-28T13:38:46.309+02:00',
    },
    toTrinnsBehandling: true,
    type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
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
            adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
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
              adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
              land: 'NOR',
              mottakerNavn: 'Pusekatt Ökänd',
              postNummer: '4614',
              poststed: null,
            },
          ],
          avklartPersonstatus: {
            orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          },
          dodsdato: null,
          ektefelle: null,
          fodselsdato: '2017-10-31',
          harVerge: false,
          navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.MANN,
          navn: 'Pusekatt Ökänd',
          nummer: null,
          personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          region: PersonopplysningDtoRegion.NORDEN,
          sivilstand: PersonopplysningDtoSivilstand.UGIFT,
          statsborgerskap: 'NOR',
        },
        avklartPersonstatus: {
          orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
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
                adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
            avklartPersonstatus: {
              orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
              overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            },
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.MANN,
            navn: 'Pusekatt Ökänd',
            nummer: null,
            personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            region: PersonopplysningDtoRegion.NORDEN,
            sivilstand: PersonopplysningDtoSivilstand.UGIFT,
            statsborgerskap: 'NOR',
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
                adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
            avklartPersonstatus: {
              orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
              overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            },
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.MANN,
            navn: 'Pusekatt Ökänd',
            nummer: null,
            personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            region: PersonopplysningDtoRegion.NORDEN,
            sivilstand: PersonopplysningDtoSivilstand.UGIFT,
            statsborgerskap: 'NOR',
          },
        ],
        dodsdato: null,
        ektefelle: null,
        fodselsdato: '1994-03-24',
        harVerge: false,
        navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.KVINNE,
        navn: 'Familie Ordknapp',
        nummer: null,
        personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        region: PersonopplysningDtoRegion.NORDEN,
        sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        statsborgerskap: 'NOR',
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
            adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
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
              adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
              land: 'NOR',
              mottakerNavn: 'Pusekatt Ökänd',
              postNummer: '4614',
              poststed: null,
            },
          ],
          avklartPersonstatus: {
            orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          },
          dodsdato: null,
          ektefelle: null,
          fodselsdato: '2017-10-31',
          harVerge: false,
          navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.MANN,
          navn: 'Pusekatt Ökänd',
          nummer: null,
          personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          region: PersonopplysningDtoRegion.NORDEN,
          sivilstand: PersonopplysningDtoSivilstand.UGIFT,
          statsborgerskap: 'NOR',
        },
        avklartPersonstatus: {
          orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
          overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
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
                adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
            avklartPersonstatus: {
              orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
              overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            },
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.MANN,
            navn: 'Pusekatt Ökänd',
            nummer: null,
            personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            region: PersonopplysningDtoRegion.NORDEN,
            sivilstand: PersonopplysningDtoSivilstand.UGIFT,
            statsborgerskap: 'NOR',
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
                adresseType: PersonadresseDtoAdresseType.BOSTEDSADRESSE,
                land: 'NOR',
                mottakerNavn: 'Pusekatt Ökänd',
                postNummer: '4614',
                poststed: null,
              },
            ],
            avklartPersonstatus: {
              orginalPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
              overstyrtPersonstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            },
            dodsdato: null,
            ektefelle: null,
            fodselsdato: '2017-10-31',
            harVerge: false,
            navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.MANN,
            navn: 'Pusekatt Ökänd',
            nummer: null,
            personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
            region: PersonopplysningDtoRegion.NORDEN,
            sivilstand: PersonopplysningDtoSivilstand.UGIFT,
            statsborgerskap: 'NOR',
          },
        ],
        dodsdato: null,
        ektefelle: null,
        fodselsdato: '1994-03-24',
        harVerge: false,
        navBrukerKjonn: PersonopplysningDtoNavBrukerKjonn.KVINNE,
        navn: 'Familie Ordknapp',
        nummer: null,
        personstatus: AvklartPersonstatusOrginalPersonstatus.BOSA,
        region: PersonopplysningDtoRegion.NORDEN,
        sivilstand: PersonopplysningDtoSivilstand.UGIFT,
        statsborgerskap: 'NOR',
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
        dokumentType: KravDokumentStatusType.INNTEKTSMELDING,
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
    spraakkode: 'NB',
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
