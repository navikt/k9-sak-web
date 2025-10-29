import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { action } from 'storybook/actions';
import { messages } from '../i18n';
import OverstyrBeregningFaktaIndex from './OverstyrBeregningFaktaIndex';
import { OverstyrInputBeregningDto } from './types/OverstyrInputBeregningDto';

const arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId = {
  '910909088': {
    identifikator: '910909088',
    personIdentifikator: null,
    navn: 'BEDRIFT AS',
    fødselsdato: null,
    erPrivatPerson: false,
    arbeidsforholdreferanser: [],
  },
  '910909081': {
    identifikator: '910909081',
    personIdentifikator: null,
    navn: 'ANNEN BEDRIFT AS',
    fødselsdato: null,
    erPrivatPerson: false,
    arbeidsforholdreferanser: [],
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
        skalKunneEndreRefusjon: false,
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
        skalKunneEndreRefusjon: true,
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
        skalKunneEndreRefusjon: false,
      },
    ],
  },
];

const aksjonspunkter: Aksjonspunkt[] = [
  {
    aksjonspunktType: {
      kode: 'MANU',
      kodeverk: 'AKSJONSPUNKT_TYPE',
    },
    begrunnelse: null,
    besluttersBegrunnelse: null,
    definisjon: {
      kode: '9005',
      kodeverk: 'AKSJONSPUNKT_DEF',
    },
    erAktivt: true,
    kanLoses: true,
    status: {
      kode: 'OPPR',
      kodeverk: 'AKSJONSPUNKT_STATUS',
    },
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
  <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningEnPeriodeKunNæring}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />);

export const visOverstyrBeregningForEnPeriodeMedFrilans = () => (
  <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningEnPeriodeKunFrilans}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />);

export const visOverstyrBeregningForEnPeriodeMedNæringOgArbeid = () => (
  <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningEnPeriodeNæringOgArbeid}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />);

export const visOverstyrBeregningToPerioder = () => (
  <OverstyrBeregningFaktaIndex
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregningToPerioder}
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={aksjonspunkter}
    />);
