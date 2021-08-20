import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import AksjonspunktBehandlerSN from './AksjonspunktsbehandlerSN';
import VurderOgFastsettSN2 from './VurderOgFastsettSN';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
} = avklaringsbehovCodes;

const mockAvklaringsbehovMedKodeOgStatus = (apKode, begrunnelse, status) => ({
  definisjon: {
    kode: apKode,
  },
  status: {
    kode: status,
  },
  begrunnelse,
  kanLoses: true,
  erAktivt: true,
});

describe('<AksjonspunktsbehandlerSN>', () => {
  it('Skal teste at riktige kompoenten renderes med riktig props', () => {
    const snNyIArb = mockAvklaringsbehovMedKodeOgStatus(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, undefined, 'OPPR');

    const wrapper = shallowWithIntl(<AksjonspunktBehandlerSN
      readOnly={false}
      avklaringsbehov={[snNyIArb]}
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const compVurderOgFastsettSN2 = wrapper.find(VurderOgFastsettSN2);
    expect(compVurderOgFastsettSN2).to.have.length(1);
  });
  it('Skal teste at kompoenten IKKE renderes med manglende props', () => {
    const snNyIArb = mockAvklaringsbehovMedKodeOgStatus(FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD, undefined, 'OPPR');

    const wrapper = shallowWithIntl(<AksjonspunktBehandlerSN
      readOnly={false}
      avklaringsbehov={[snNyIArb]}
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const compVurderOgFastsettSN2 = wrapper.find(VurderOgFastsettSN2);
    expect(compVurderOgFastsettSN2).to.have.length(0);
  });
});
