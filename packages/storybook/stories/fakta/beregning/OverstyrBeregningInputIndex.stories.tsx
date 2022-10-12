import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '@fpsak-frontend/fakta-overstyr-beregning/i18n';
import OverstyrBeregningFaktaIndex from '@fpsak-frontend/fakta-overstyr-beregning';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { OverstyrInputBeregningDto } from '@fpsak-frontend/fakta-overstyr-beregning/src/types/OverstyrInputBeregningDto';
import { action } from '@storybook/addon-actions';

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages: { ...messages },
  },
  createIntlCache(),
);

const arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId = {
  '910909088': {
    identifikator: '910909088',
    personIdentifikator: null,
    navn: 'BEDRIFT AS',
    fødselsdato: null,
    erPrivatPerson: false,
    arbeidsforholdreferanser: []
  },
  '910909081': {
    identifikator: '910909081',
    personIdentifikator: null,
    navn: 'ANNEN BEDRIFT AS',
    fødselsdato: null,
    erPrivatPerson: false,
    arbeidsforholdreferanser: []

  },
};

const overstyrInputBeregningEnPeriodeKunNæring: OverstyrInputBeregningDto[] = [
  {
    skjaeringstidspunkt: '2021-10-04',
    harKategoriNæring: true,
    harKategoriFrilans: false,
    aktivitetliste: [],
  },
];

const overstyrInputBeregningEnPeriodeNæringOgArbeid: OverstyrInputBeregningDto[] = [
  {
    skjaeringstidspunkt: '2021-10-04',
    harKategoriNæring: true,
    harKategoriFrilans: false,
    aktivitetliste: [
      {
        arbeidsgiverOrgnr: '910909088',
        arbeidsgiverAktørId: null,
        inntektPrAar: null,
        refusjonPrAar: null,
        startdatoRefusjon: null,
        opphørRefusjon: null,
        skalKunneEndreRefusjon: false
      },
    ],
  },
];

const overstyrInputBeregningEnPeriodeKunFrilans: OverstyrInputBeregningDto[] = [
  {
    skjaeringstidspunkt: '2021-10-04',
    harKategoriNæring: false,
    harKategoriFrilans: true,
    aktivitetliste: [],
  },
];

const overstyrInputBeregningToPerioder: OverstyrInputBeregningDto[] = [
  {
    skjaeringstidspunkt: '2021-10-04',
    aktivitetliste: [
      {
        arbeidsgiverOrgnr: '910909088',
        arbeidsgiverAktørId: null,
        inntektPrAar: null,
        refusjonPrAar: null,
        startdatoRefusjon: null,
        opphørRefusjon: null,
        skalKunneEndreRefusjon: true
      },
    ],
  },
  {
    skjaeringstidspunkt: '2021-10-04',
    aktivitetliste: [
      {
        arbeidsgiverOrgnr: '910909081',
        arbeidsgiverAktørId: null,
        inntektPrAar: null,
        refusjonPrAar: null,
        startdatoRefusjon: null,
        opphørRefusjon: null,
        skalKunneEndreRefusjon: false
      },
    ],
  },
];

const aksjonspunkter: Aksjonspunkt[] = [
  {
    aksjonspunktType: 'MANU',
    begrunnelse: null,
    besluttersBegrunnelse: null,
    definisjon: '9005',
    erAktivt: true,
    kanLoses: true,
    status: 'OPPR',
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: null,
    vilkarType: null,
    vurderPaNyttArsaker: null,
  },
];

export default {
  title: 'fakta/overstyr-beregning-input',
  component: OverstyrBeregningFaktaIndex,
};

export const visOverstyrBeregningForEnPeriodeMedNæring = () => (
  <RawIntlProvider value={intl}>
    <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningEnPeriodeKunNæring}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />
  </RawIntlProvider>
);

export const visOverstyrBeregningForEnPeriodeMedFrilans = () => (
  <RawIntlProvider value={intl}>
    <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningEnPeriodeKunFrilans}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />
  </RawIntlProvider>
);

export const visOverstyrBeregningForEnPeriodeMedNæringOgArbeid = () => (
  <RawIntlProvider value={intl}>
    <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningEnPeriodeNæringOgArbeid}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />
  </RawIntlProvider>
);

export const visOverstyrBeregningToPerioder = () => (
  <RawIntlProvider value={intl}>
    <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningToPerioder}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />
  </RawIntlProvider>
);
