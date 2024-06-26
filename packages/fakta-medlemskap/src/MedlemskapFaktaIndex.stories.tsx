import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import MedlemskapFaktaIndex from './MedlemskapFaktaIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FORSTEGANGSSOKNAD,
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
    kilde: '-',
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
      medlemskapType: 'AVKLARES', // MEDLEMSKAP_TYPE
      dekningType: 'OPPHOR', // MEDLEMSKAP_DEKNING
      kildeType: 'FS22', // MEDLEMSKAP_KILDE
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
        navBrukerKjonn: 'K', // BRUKER_KJOENN
        statsborgerskap: 'NOR', // LANDKODER
        avklartPersonstatus: {
          orginalPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
          overstyrtPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
        },
        personstatus: 'BOSA', // PERSONSTATUS_TYPE
        sivilstand: 'UGIF', // SIVILSTAND_TYPE
        navn: 'Mygg Robust',
        dodsdato: null,
        fodselsdato: '1966-08-02',
        adresser: [
          {
            adresseType: 'BOSTEDSADRESSE', // ADRESSE_TYPE
            mottakerNavn: 'Mygg Robust',
            adresselinje1: 'Skogvegen 3',
            adresselinje2: null,
            adresselinje3: null,
            postNummer: '4353',
            poststed: 'Klepp Stasjon',
            land: 'NOR',
          },
        ],
        region: 'NORDEN', // REGION
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
        navBrukerKjonn: 'K', // BRUKER_KJOENN
        statsborgerskap: 'NOR', // LANDKODER
        avklartPersonstatus: {
          orginalPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
          overstyrtPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
        },
        personstatus: 'BOSA', // PERSONSTATUS_TYPE
        sivilstand: 'UGIF', // SIVILSTAND_TYPE
        navn: 'Mygg Robust',
        dodsdato: null,
        fodselsdato: '1966-08-02',
        adresser: [],
        region: 'NORDEN', // REGION
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
const fagsakPerson = {};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-medlemskap',
  component: MedlemskapFaktaIndex,
};

export const visAksjonspunktForAvklaringAvStartdatoForForeldrepengerperioden = args => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <MedlemskapFaktaIndex
      aksjonspunkter={[
        {
          definisjon: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
          kanLoses: true,
          erAktivt: true,
        },
      ]}
      alleKodeverk={alleKodeverk}
      submitCallback={action('button-click')}
      {...args}
    />
  </KodeverkProvider>
);

visAksjonspunktForAvklaringAvStartdatoForForeldrepengerperioden.args = {
  behandling,
  medlemskap,
  soknad,
  arbeidsforhold,
  fagsakPerson,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN]: merknaderFraBeslutter,
  },
  isForeldrepengerFagsak: true,
  readOnly: false,
  readOnlyBehandling: false,
  harApneAksjonspunkter: true,
  submittable: true,
};

export const visAksjonspunktForAlleAndreMedlemskapsaksjonspunkter = args => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <MedlemskapFaktaIndex
      aksjonspunkter={[
        {
          definisjon: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
          kanLoses: true,
          erAktivt: true,
        },
        {
          definisjon: aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
          kanLoses: true,
          erAktivt: true,
        },
        {
          definisjon: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
          kanLoses: true,
          erAktivt: true,
        },
        {
          definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
          kanLoses: true,
          erAktivt: true,
        },
      ]}
      alleKodeverk={alleKodeverk}
      submitCallback={action('button-click')}
      {...args}
    />
  </KodeverkProvider>
);

visAksjonspunktForAlleAndreMedlemskapsaksjonspunkter.args = {
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
