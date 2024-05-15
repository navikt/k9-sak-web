/* eslint-disable import/no-relative-packages */
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { action } from '@storybook/addon-actions';
import React from 'react';
import alleKodeverk from '../../storybook/stories/mocks/alleKodeverk.json';
import arbeidsgivere from '../../storybook/stories/mocks/arbeidsgivere.json';
import ArbeidsforholdFaktaIndex from './ArbeidsforholdFaktaIndex';
import arbeidsforholdKilder from './kodeverk/arbeidsforholdKilder';

const behandling = {
  id: 1,
  versjon: 1,
};

// id?: string;
// arbeidsforhold?: ArbeidsforholdId;
// arbeidsgiver?: Arbeidsgiver;
// yrkestittel?: string;
// begrunnelse?: string;
// perioder: Periode[];
// handlingType: Kodeverk;
// kilde: Kodeverk[];
// permisjoner?: {
//   permisjonFom?: string;
//   permisjonTom?: string;
//   permisjonsprosent?: number;
//   type?: Kodeverk;
// }[];
// stillingsprosent?: number;
// aksjonspunktÅrsaker: Kodeverk[];
// inntektsmeldinger: Inntektsmelding[];

// arbeidsgiverOrgnr?: string;
// arbeidsgiverAktørId?: string;
// organisasjonsnummer?: string;
// aktørId?: string;
// navn?: string;

const arbeidsforhold = {
  id: '1',
  kilde: {
    navn: arbeidsforholdKilder.INNTEKTSMELDING,
  },
  arbeidsgiver: { arbeidsgiverOrgnr: '11212', organisasjonsnummer: '11212' },
  arbeidsforhold: { eksternArbeidsforholdId: '123', internArbeidsforholdId: '11212' },
  inntektsmeldinger: [{ mottattTidspunkt: '2019-01-01' }],
  perioder: [{ fom: '2018-01-01', tom: '2019-01-01' }],
  stillingsprosent: 100,
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-arbeidsforhold',
  component: ArbeidsforholdFaktaIndex,
};

export const visAksjonspunktForAvklaringAvArbeidsforhold = args => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
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
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    submitCallback={action('button-click')}
    {...args}
  />
);

visAksjonspunktForAvklaringAvArbeidsforhold.args = {
  arbeidsforhold: [
    {
      ...arbeidsforhold,
      tilVurdering: true,
      mottattDatoInntektsmelding: undefined,
    },
    {
      ...arbeidsforhold,
      navn: 'NSB',
      id: '2',
      tilVurdering: true,
      mottattDatoInntektsmelding: undefined,
    },
  ],
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: merknaderFraBeslutter,
  },
  harApneAksjonspunkter: true,
  readOnly: false,
};

export const visAksjonspunktForIngenArbeidsforholdRegistrert = args => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
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
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    submitCallback={action('button-click')}
    {...args}
  />
);

visAksjonspunktForIngenArbeidsforholdRegistrert.args = {
  arbeidsforhold: [],
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: merknaderFraBeslutter,
  },
  harApneAksjonspunkter: true,
  readOnly: false,
};

export const visPanelUtenAksjonspunkter = args => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    alleMerknaderFraBeslutter={{}}
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelUtenAksjonspunkter.args = {
  arbeidsforhold: [arbeidsforhold],
  harApneAksjonspunkter: false,
  readOnly: false,
};

export const visPanelForPermisjon = args => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
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
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelForPermisjon.args = {
  arbeidsforhold: [
    {
      ...arbeidsforhold,
      mottattDatoInntektsmelding: undefined,
      tilVurdering: true,
      permisjoner: [
        {
          type: {
            kode: 'PERMISJON',
          },
          permisjonFom: '2018-10-10',
          permisjonTom: '2019-10-10',
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
    },
  ],
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: merknaderFraBeslutter,
  },
  harApneAksjonspunkter: true,
  readOnly: false,
};

export const visPanelForFlerePermisjoner = args => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
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
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    submitCallback={action('button-click')}
    {...args}
  />
);

visPanelForFlerePermisjoner.args = {
  arbeidsforhold: [
    {
      ...arbeidsforhold,
      tilVurdering: true,
      permisjoner: [
        {
          type: {
            kode: 'PERMISJON',
          },
          permisjonFom: '2015-01-01',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
        {
          type: {
            kode: 'PERMISJON',
          },
          permisjonFom: '2017-01-01',
          permisjonTom: '2019-01-01',
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
    },
  ],
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: merknaderFraBeslutter,
  },
  harApneAksjonspunkter: true,
  readOnly: false,
};
