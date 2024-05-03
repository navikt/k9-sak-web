import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import ArbeidsforholdFaktaIndex from '@k9-sak-web/fakta-arbeidsforhold';
import arbeidsforholdKilder from '@k9-sak-web/fakta-arbeidsforhold/src/kodeverk/arbeidsforholdKilder';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';
import arbeidsgivere from '../mocks/arbeidsgivere.json';

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
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAvklaringAvArbeidsforhold = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    arbeidsforhold={object('arbeidsforhold', [
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
    ])}
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
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);

export const visAksjonspunktForIngenArbeidsforholdRegistrert = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    arbeidsforhold={object('arbeidsforhold', [])}
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
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    readOnly={boolean('readOnly', false)}
  />
);

export const visPanelUtenAksjonspunkter = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    arbeidsforhold={object('arbeidsforhold', [arbeidsforhold])}
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    alleMerknaderFraBeslutter={{}}
    submitCallback={action('button-click')}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', false)}
    readOnly={boolean('readOnly', false)}
  />
);

export const visPanelForPermisjon = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    arbeidsforhold={object('arbeidsforhold', [
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
    ])}
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
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);

export const visPanelForFlerePermisjoner = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    arbeidsforhold={object('arbeidsforhold', [
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
    ])}
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
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);
