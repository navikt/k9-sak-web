import ContainerContract from '../src/types/ContainerContract';
import Aksjonspunkt from '../src/types/Aksjonspunkt';

interface ArbeidsforholdReferanse {
  internArbeidsforholdId: string;
  eksternArbeidsforholdId: string;
}

interface ArbeidsgiverInfo {
  identifikator: string;
  personIdentifikator: string | null;
  navn: string;
  fødselsdato: string | null;
  arbeidsforholdreferanser: ArbeidsforholdReferanse[];
}

interface MockProps extends Omit<ContainerContract, 'onFinished'> {
  arbeidsforhold: Record<string, ArbeidsgiverInfo>;
  onFinished?: ContainerContract['onFinished'];
}

const createAksjonspunkt = (kode: string, statusKode: string): Aksjonspunkt => ({
  aksjonspunktType: {
    kode: 'MANU',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  begrunnelse: undefined,
  besluttersBegrunnelse: 'evvv',
  definisjon: {
    kode,
    kodeverk: 'AKSJONSPUNKT_DEF',
  },
  erAktivt: true,
  kanLoses: true,
  status: {
    kode: statusKode,
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: false,
  vilkarType: undefined,
  vurderPaNyttArsaker: [
    {
      kode: 'ANNET',
      kodeverk: 'VURDER_AARSAK',
    },
  ],
});

const arbeidsforhold: Record<string, ArbeidsgiverInfo> = {
  896929119: {
    identifikator: '896929119',
    personIdentifikator: null,
    navn: 'SAUEFABRIKK',
    fødselsdato: null,
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: '99ab90b6-98fd-4ab8-8632-fc08d8cb898e',
        eksternArbeidsforholdId: '2',
      },
    ],
  },
  972674818: {
    identifikator: '972674818',
    personIdentifikator: null,
    navn: 'PENGELØS SPAREBANK',
    fødselsdato: null,
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: 'b8c8b29f-42da-4aef-9714-6fbc9772079f',
        eksternArbeidsforholdId: '1',
      },
    ],
  },
};

const inntektsmeldingPropsMock: MockProps = {
  arbeidsforhold,
  endpoints: {
    kompletthetBeregning: 'tilstand',
  },
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9069', 'OPPR')],
};

export default inntektsmeldingPropsMock;

export const aksjonspunkt9071Props: MockProps = {
  arbeidsforhold,
  endpoints: {
    kompletthetBeregning: 'tilstand',
  },
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9071', 'OPPR')],
};

export const aksjonspunkt9071FerdigProps: MockProps = {
  arbeidsforhold,
  endpoints: {
    kompletthetBeregning: 'tilstand',
  },
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9071', 'UTFORT')],
};
