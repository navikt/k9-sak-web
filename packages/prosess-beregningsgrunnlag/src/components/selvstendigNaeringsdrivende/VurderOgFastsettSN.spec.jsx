import React from 'react';
import { expect } from 'chai';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import VurderOgFastsettSN, { VurderOgFastsettSNImpl } from './VurderOgFastsettSN';
import VurderVarigEndretEllerNyoppstartetSN2, {
  begrunnelseFieldname as vurderingBegrunnelse,
  varigEndringRadioname,
} from './VurderVarigEndretEllerNyoppstartetSN';
import FastsettSN2, { begrunnelseFieldname as fastsettingBegrunnelse, fastsettInntektFieldname } from './FastsettSN';
import shallowWithIntl from '../../../i18n';

const {
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
} = avklaringsbehovCodes;

const mockAvklaringsbehovMedKodeOgStatus = (apKode, begrunnelse, status) => ({
  definisjon: apKode,
  status: status,
  begrunnelse,
  kanLoses: true,
  erAktivt: true,
});

describe('<VurderOgFastsettSN>', () => {
  it('Skal vise korrekte komponenter når det er aksjonspunkt for å fastsette inntekt for bruker ny i arbeidslivet', () => {
    const wrapper = shallowWithIntl(
      <VurderOgFastsettSNImpl
        readOnly={false}
        erVarigEndretNaering={undefined}
        isAvklaringsbehovClosed={false}
        erNyArbLivet
        erVarigEndring
        erNyoppstartet={false}
        avklaringsbehov={[
          mockAvklaringsbehovMedKodeOgStatus(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, undefined, 'OPPR'),
        ]}
        fieldArrayID="dummyId"
      />,
    );
    expect(wrapper.find(FastsettSN2)).to.have.length(1);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).to.have.length(0);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring uten at varig endring er bestemt', () => {
    const vurderEndring = mockAvklaringsbehovMedKodeOgStatus(
      VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      undefined,
      'OPPR',
    );
    const wrapper = shallowWithIntl(
      <VurderOgFastsettSNImpl
        readOnly={false}
        erVarigEndretNaering={undefined}
        isAvklaringsbehovClosed={false}
        avklaringsbehov={[vurderEndring]}
        erNyArbLivet={false}
        erVarigEndring
        erNyoppstartet={false}
        fieldArrayID="dummyId"
      />,
    );
    expect(wrapper.find(FastsettSN2)).to.have.length(0);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).to.have.length(1);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring og det er vurdert at det ikke er varig endring', () => {
    const vurderEndring = mockAvklaringsbehovMedKodeOgStatus(
      VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      undefined,
      'OPPR',
    );
    const wrapper = shallowWithIntl(
      <VurderOgFastsettSNImpl
        readOnly={false}
        erVarigEndretNaering={false}
        isAvklaringsbehovClosed={false}
        erNyArbLivet={false}
        avklaringsbehov={[vurderEndring]}
        erVarigEndring
        erNyoppstartet={false}
        fieldArrayID="dummyId"
      />,
    );
    expect(wrapper.find(FastsettSN2)).to.have.length(0);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).to.have.length(1);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring og det er vurdert at det er varig endring', () => {
    const vurderEndring = mockAvklaringsbehovMedKodeOgStatus(
      VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      undefined,
      'OPPR',
    );
    const wrapper = shallowWithIntl(
      <VurderOgFastsettSNImpl
        readOnly={false}
        erVarigEndretNaering
        isAvklaringsbehovClosed={false}
        erNyArbLivet={false}
        avklaringsbehov={[vurderEndring]}
        erVarigEndring
        erNyoppstartet={false}
        fieldArrayID="dummyId"
      />,
    );
    expect(wrapper.find(FastsettSN2)).to.have.length(1);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN2)).to.have.length(1);
  });

  it('Skal teste at transformValues setter korrekte values når det kun skal fastsettes inntekt for søker ny i arbeidslivet', () => {
    const snNyIArb = mockAvklaringsbehovMedKodeOgStatus(
      FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
      undefined,
      'OPPR',
    );
    const values = {
      [fastsettingBegrunnelse]: 'Ok.',
      [fastsettInntektFieldname]: '360 000',
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [snNyIArb]);
    const expectedTransformedValues = {
      kode: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
      begrunnelse: 'Ok.',
      bruttoBeregningsgrunnlag: 360000,
    };
    expect(transformedValues).to.deep.equal(expectedTransformedValues);
  });

  it('Skal teste at transformValues setter korrekte values når det er vurdert at det ikke er varig endret næring', () => {
    const vurderEndring = mockAvklaringsbehovMedKodeOgStatus(
      VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      undefined,
      'OPPR',
    );
    const values = {
      [vurderingBegrunnelse]: 'Ok.',
      [varigEndringRadioname]: false,
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [vurderEndring]);
    const expectedTransformedValues = {
      kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      begrunnelse: 'Ok.',
      erVarigEndretNaering: false,
      [fastsettInntektFieldname]: undefined,
    };
    expect(transformedValues).to.deep.equal(expectedTransformedValues);
  });

  it('Skal teste at transformValues setter korrekte values når det er vurdert at det er varig endret næring og inntekt er fastsatt', () => {
    const vurderEndring = mockAvklaringsbehovMedKodeOgStatus(
      VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      undefined,
      'OPPR',
    );
    const values = {
      [vurderingBegrunnelse]: 'Ok varig endring.',
      [fastsettingBegrunnelse]: 'Ok fastsatt inntekt.',
      [varigEndringRadioname]: true,
      [fastsettInntektFieldname]: '650 000',
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [vurderEndring]);
    const expectedTransformedValues = {
      kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      begrunnelse: 'Ok varig endring.',
      erVarigEndretNaering: true,
      bruttoBeregningsgrunnlag: 650000,
    };
    expect(transformedValues).to.deep.equal(expectedTransformedValues);
  });
});
