import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import { ATFLSammeOrgTekst, transformValuesForATFLISammeOrg } from './ATFLSammeOrg';

describe('<ATFLSammeOrg>', () => {
  it('skal ikke vise tekst når man ikke har tilfelle', () => {
    const wrapper = shallow(
      <ATFLSammeOrgTekst
        beregningsgrunnlag={{
          faktaOmBeregning: { faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE] },
        }}
        manglerInntektsmelding
      />,
    );
    expect(wrapper.find(Normaltekst).length).to.equal(0);
  });

  it('skal vise tekst når man har tilfelle uten inntektsmelding', () => {
    const beregningsgrunnlag = {
      faktaOmBeregning: {
        faktaOmBeregningTilfeller: [
          faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE,
          faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
        ],
      },
    };
    const wrapper = shallow(<ATFLSammeOrgTekst beregningsgrunnlag={beregningsgrunnlag} manglerInntektsmelding />);
    const msg = wrapper.find(FormattedMessage);
    expect(msg.length).to.equal(1);
    expect(msg.props().id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM');
  });

  it('skal vise tekst når man har tilfelle med inntektsmelding', () => {
    const beregningsgrunnlag = {
      faktaOmBeregning: {
        faktaOmBeregningTilfeller: [
          faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE,
          faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
        ],
      },
    };
    const wrapper = shallow(
      <ATFLSammeOrgTekst beregningsgrunnlag={beregningsgrunnlag} manglerInntektsmelding={false} />,
    );
    const msg = wrapper.find(FormattedMessage);
    expect(msg.length).to.equal(1);
    expect(msg.props().id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrg');
  });

  const arbeidsforhold = {
    arbeidsgiverIdent: '123',
    arbeidsforholdId: 'abc',
    startdato: '2018-01-01',
  };

  const faktaOmBeregningFrilansAndel = {
    andelsnr: 1,
    arbeidsforhold: null,
    inntektskategori: inntektskategorier.FRILANSER,
    aktivitetStatus: aktivitetStatus.FRILANSER,
    lagtTilAvSaksbehandler: false,
  };

  const faktaOmBeregningATAndel = {
    andelsnr: 2,
    arbeidsforhold,
    inntektskategori: inntektskategorier.ARBEIDSTAKER,
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
    lagtTilAvSaksbehandler: false,
  };

  const frilansAndelInntekt = {
    andelsnr: 1,
    fastsattBelop: 10000,
    inntektskategori: inntektskategorier.FRILANSER,
    nyAndel: false,
    lagtTilAvSaksbehandler: false,
    aktivitetStatus: aktivitetStatus.FRILANSER,
  };

  const arbeidstakerInntekt = {
    andelsnr: 2,
    fastsattBelop: 20000,
    inntektskategori: inntektskategorier.ARBEIDSTAKER,
    nyAndel: false,
    lagtTilAvSaksbehandler: false,
    aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
  };

  const inntektVerdier = [frilansAndelInntekt, arbeidstakerInntekt];

  it('skal ikkje transform values uten tilfelle', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_LONNSENDRING],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [{ ...faktaOmBeregningATAndel, inntektPrMnd: 10000 }],
      frilansAndel: faktaOmBeregningFrilansAndel,
    };

    const transformed = transformValuesForATFLISammeOrg(inntektVerdier, faktaOmBeregning, []);
    expect(transformed.faktaOmBeregningTilfeller.length).to.equal(0);
  });

  it('skal transform values', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [{ ...faktaOmBeregningATAndel, inntektPrMnd: 10000 }],
      frilansAndel: faktaOmBeregningFrilansAndel,
    };

    const fastsatteAndeler = [];
    const transformed = transformValuesForATFLISammeOrg(inntektVerdier, faktaOmBeregning, fastsatteAndeler);
    expect(transformed.faktaOmBeregningTilfeller.length).to.equal(1);
    expect(
      transformed.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON),
    ).to.equal(true);
    expect(transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe.length).to.equal(2);
    expect(transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe[1].andelsnr).to.equal(1);
    expect(
      transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe[1].arbeidsinntekt,
    ).to.equal(10000);
    expect(transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe[0].andelsnr).to.equal(2);
    expect(
      transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe[0].arbeidsinntekt,
    ).to.equal(20000);
    expect(fastsatteAndeler.length).to.equal(2);
    expect(fastsatteAndeler.includes(1)).to.equal(true);
    expect(fastsatteAndeler.includes(2)).to.equal(true);
  });

  it('skal ikkje transform values når andelsnr har blitt submittet fra før', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [{ ...faktaOmBeregningATAndel, inntektPrMnd: 10000 }],
      frilansAndel: faktaOmBeregningFrilansAndel,
    };

    const fastsatteAndeler = [1];
    const transformed = transformValuesForATFLISammeOrg(inntektVerdier, faktaOmBeregning, fastsatteAndeler);
    expect(transformed.faktaOmBeregningTilfeller.length).to.equal(1);
    expect(
      transformed.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON),
    ).to.equal(true);
    expect(transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe.length).to.equal(1);
    expect(transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe[0].andelsnr).to.equal(2);
    expect(
      transformed.vurderATogFLiSammeOrganisasjon.vurderATogFLiSammeOrganisasjonAndelListe[0].arbeidsinntekt,
    ).to.equal(20000);
    expect(fastsatteAndeler.length).to.equal(2);
    expect(fastsatteAndeler.includes(1)).to.equal(true);
    expect(fastsatteAndeler.includes(2)).to.equal(true);
  });
});
