import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { InntektsmeldingContainerProps } from '../src/ui/InntektsmeldingIndex';

type MockProps = Omit<InntektsmeldingContainerProps, 'submitCallback' | 'behandling'> & {
  submitCallback?: InntektsmeldingContainerProps['submitCallback'];
};

const createAksjonspunkt = (definisjon: '9069' | '9071', status: 'OPPR' | 'UTFO' | 'AVBR'): AksjonspunktDto => ({
  aksjonspunktType: 'MANU',
  begrunnelse: undefined,
  besluttersBegrunnelse: undefined,
  definisjon,
  erAktivt: status === 'OPPR',
  kanLoses: true,
  status,
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: false,
  vilkarType: undefined,
  vurderPaNyttArsaker: ['ANNET'],
});

const mockArbeidsgiverOpplysninger = {
  896929119: { navn: 'SAUEFABRIKK', arbeidsforholdreferanser: [] },
  972674818: { navn: 'PENGELØS SPAREBANK', arbeidsforholdreferanser: [] },
};

const inntektsmeldingPropsMock: MockProps = {
  arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9069', 'OPPR')],
};

export default inntektsmeldingPropsMock;

export const aksjonspunkt9071Props: MockProps = {
  arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9071', 'OPPR')],
};

export const aksjonspunkt9071FerdigProps: MockProps = {
  arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  readOnly: false,
  aksjonspunkter: [createAksjonspunkt('9071', 'UTFO')],
};
