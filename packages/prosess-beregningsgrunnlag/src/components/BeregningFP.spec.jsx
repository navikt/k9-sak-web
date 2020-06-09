import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme/build';
import { FieldArray } from 'redux-form';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { BeregningFP } from './BeregningFP';
import GraderingUtenBGFieldArrayComponent from './GraderingUtenBGFieldArrayComponent';
import BeregningForm2 from './beregningForm/BeregningForm';
import GraderingUtenBG2 from './gradering/GraderingUtenBG';

const lagBeregningsgrunnlag = (ferdigstilt, beregnetPrAar, sammenligningSum, avvikPromille, gradering) => {
  const beregningsgrunnlag = {
    halvG: 30000,
    ledetekstBrutto: 'Brutto tekst',
    ledetekstAvkortet: 'Avkortet tekst',
    ledetekstRedusert: 'Redusert tekst',
    skjaeringstidspunktBeregning: '12.12.2017',
    årsinntektVisningstall: beregnetPrAar,
    andelerMedGraderingUtenBG: gradering,
    sammenligningsgrunnlag: {
      avvikPromille,
      rapportertPrAar: sammenligningSum,
    },
    aktivitetStatus: [
      {
        kode: aktivitetStatus.KOMBINERT_AT_SN,
        navn: 'Arbeidstaker',
        kodeverk: 'test',
      },
    ],
    beregningsgrunnlagPeriode: [
      {
        dagsats: ferdigstilt ? 1500 : undefined,
      },
    ],
  };
  return beregningsgrunnlag;
};

const vilkar = [
  {
    vilkarType: {
      kode: 'FP_VK_41',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.OPPFYLT,
    },
  },
];

const graderingAP = [
  {
    id: 55,
    erAktivt: true,
    definisjon: {
      kode: aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
      navn: 'Fastsett varig brutto beregning ATFL',
    },
    toTrinnsBehandling: false,
    status: {
      kode: 'OPPR',
      navn: 'Opprettet',
    },
    begrunnelse: 'begrunnelse arbeidstaker/frilans',
    vilkarType: null,
    kanLoses: true,
  },
];

const gjeldendeAksjonspunkter = [
  {
    id: 55,
    erAktivt: true,
    definisjon: {
      kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      navn: 'Fastsett varig brutto beregning ATFL',
    },
    toTrinnsBehandling: false,
    status: {
      kode: 'OPPR',
      navn: 'Opprettet',
    },
    begrunnelse: 'begrunnelse arbeidstaker/frilans',
    vilkarType: null,
    kanLoses: true,
  },
];

const behandling = {
  id: 1,
  versjon: 1,
  venteArsakKode: '-',
  sprakkode: {
    kode: 'NB',
    kodeverk: 'Språkode',
  },
};

const alleKodeverk = {
  test: 'test',
};

describe('<BeregningFP>', () => {
  it('skal teste at BeregningForm får korrekte props fra BeregningFP med beregnetAvvikPromille lik NULL', () => {
    const wrapper = shallow(
      <BeregningFP
        readOnly={false}
        submitCallback={sinon.spy}
        beregningsgrunnlag={lagBeregningsgrunnlag(true, 100000, 100000, null, null)}
        vilkar={vilkar}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        aksjonspunkter={gjeldendeAksjonspunkter}
        readOnlySubmitButton
        sokerHarGraderingPaaAndelUtenBG={false}
        intl={intlMock}
        handleSubmit={() => {}}
      />,
    );
    const beregningForm = wrapper.find(FieldArray);
    expect(beregningForm.props().props.readOnly).to.have.equal(false);
    expect(beregningForm.props().props.gjeldendeAksjonspunkter).to.eql(gjeldendeAksjonspunkter);
    expect(beregningForm.props().props.relevanteStatuser.isArbeidstaker).to.eql(true);
    expect(beregningForm.props().props.relevanteStatuser.isSelvstendigNaeringsdrivende).to.eql(true);
    expect(beregningForm.props().props.relevanteStatuser.isKombinasjonsstatus).to.eql(true);
    expect(beregningForm.props().props.relevanteStatuser.skalViseBeregningsgrunnlag).to.eql(true);
    expect(beregningForm.props().props.submitCallback).to.have.equal(sinon.spy);
  });
  it('skal teste visning av komponenter når beregningsgrunnlag er lik null', () => {
    const wrapper = shallow(
      <BeregningFP
        readOnly={false}
        submitCallback={sinon.spy}
        beregningsgrunnlag={null}
        vilkar={vilkar}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        aksjonspunkter={gjeldendeAksjonspunkter}
        readOnlySubmitButton
        intl={intlMock}
        handleSubmit={() => {}}
      />,
    );
    const beregningForm = wrapper.find(BeregningForm2);
    expect(beregningForm).to.be.lengthOf(0);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.be.lengthOf(2);
    expect(messages.get(0).props.id).to.equal('Beregningsgrunnlag.Title');
    expect(messages.get(1).props.id).to.equal('Beregningsgrunnlag.HarIkkeBeregningsregler');
  });
  it('skal teste visning av komponenter når beregningsgrunnlag ikke er null', () => {
    const wrapper = shallow(
      <BeregningFP
        readOnly={false}
        submitCallback={sinon.spy}
        alleKodeverk={alleKodeverk}
        beregningsgrunnlag={lagBeregningsgrunnlag(true, 250000, 250000, undefined, null)}
        vilkar={vilkar}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        aksjonspunkter={gjeldendeAksjonspunkter}
        behandling={behandling}
        readOnlySubmitButton
        intl={intlMock}
        handleSubmit={() => {}}
      />,
    );
    const beregningForm = wrapper.find(FieldArray);
    expect(beregningForm).to.be.lengthOf(1);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.be.lengthOf(0);
  });
  it('skal teste at GraderingUtenBG vises når sokerHarGraderingPaaAndelUtenBG er true', () => {
    const wrapper = shallow(
      <BeregningFP
        readOnly={false}
        submitCallback={sinon.spy}
        beregningsgrunnlag={lagBeregningsgrunnlag(true, 250000, 250000, undefined, [{ test: 'test' }])}
        vilkar={vilkar}
        gjeldendeAksjonspunkter={graderingAP}
        aksjonspunkter={graderingAP}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        readOnlySubmitButton
        intl={intlMock}
        handleSubmit={() => {}}
      />,
    );
    const graderingUtenBG = wrapper.find(FieldArray);
    expect(graderingUtenBG.at(1).props().component).equals(GraderingUtenBGFieldArrayComponent);
  });

  it('skal teste at GraderingUtenBG ikke vises når sokerHarGraderingPaaAndelUtenBG er false', () => {
    const wrapper = shallow(
      <BeregningFP
        readOnly={false}
        submitCallback={sinon.spy}
        beregningsgrunnlag={lagBeregningsgrunnlag(true, 250000, 250000, undefined, null)}
        vilkar={vilkar}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        aksjonspunkter={gjeldendeAksjonspunkter}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        readOnlySubmitButton
        intl={intlMock}
        handleSubmit={() => {}}
      />,
    );
    const graderingUtenBG = wrapper.find(GraderingUtenBG2);
    expect(graderingUtenBG).to.be.lengthOf(0);
  });
});
