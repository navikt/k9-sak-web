import type { InntektsmeldingContainerProps } from '../src/ui/InntektsmeldingContainer';
import type { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';

type MockProps = Omit<InntektsmeldingContainerProps, 'submitCallback'> & {
  submitCallback?: InntektsmeldingContainerProps['submitCallback'];
};

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

const mockBehandling: BehandlingAppKontekst = {
  uuid: 'mock-behandling-uuid',
} as BehandlingAppKontekst;

const inntektsmeldingPropsMock: MockProps = {
  behandling: mockBehandling,
  arbeidsgiverOpplysningerPerId: {
    896929119: { navn: 'SAUEFABRIKK' },
    972674818: { navn: 'PENGELØS SPAREBANK' },
  },
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9069', 'OPPR')],
};

export default inntektsmeldingPropsMock;

export const aksjonspunkt9071Props: MockProps = {
  behandling: mockBehandling,
  arbeidsgiverOpplysningerPerId: {
    896929119: { navn: 'SAUEFABRIKK' },
    972674818: { navn: 'PENGELØS SPAREBANK' },
  },
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9071', 'OPPR')],
};

export const aksjonspunkt9071FerdigProps: MockProps = {
  behandling: mockBehandling,
  arbeidsgiverOpplysningerPerId: {
    896929119: { navn: 'SAUEFABRIKK' },
    972674818: { navn: 'PENGELØS SPAREBANK' },
  },
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9071', 'UTFORT')],
};
