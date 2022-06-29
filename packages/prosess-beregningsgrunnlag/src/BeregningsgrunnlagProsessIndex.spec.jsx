import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import shallowWithIntl from '../i18n';
import BeregningsgrunnlagProsessIndex from './BeregningsgrunnlagProsessIndex';
import BeregningFP from './components/BeregningFP';

const behandling = {
  id: 1,
  versjon: 1,
  venteArsakKode: venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
  sprakkode: '-',
};
const vilkarMedUtfall = kode => [
  {
    vilkarType: vilkarType.BEREGNINGSGRUNNLAGVILKARET,
    vilkarStatus: kode,
  },
];
const lagPeriode = () => ({
  beregningsgrunnlagPeriodeFom: '2019-09-16',
  beregningsgrunnlagPeriodeTom: undefined,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  beregningsgrunnlagPrStatusOgAndel: [{ aktivitetStatus: 'AT' }],
  andelerLagtTilManueltIForrige: [],
});
const lagBeregningsgrunnlag = (avvikPromille, årsinntektVisningstall, sammenligningSum, dekningsgrad, tilfeller) => ({
  beregningsgrunnlagPeriode: [lagPeriode()],
  sammenligningsgrunnlag: {
    avvikPromille,
    rapportertPrAar: sammenligningSum,
  },
  dekningsgrad,
  årsinntektVisningstall,
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: tilfeller,
  },
  aktivitetStatus: ['UDEFINERT'],
});
const sammenligningsgrunnlag = kode => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar: 330000,
  avvikPromille: 275,
  avvikProsent: 27.5,
  sammenligningsgrunnlagType: kode,
  differanseBeregnet: 12100,
});
const alleKodeverk = {
  test: 'test',
};

describe('<BeregningsgrunnlagProsessIndex>', () => {
  it('skal teste at BeregningsgrunnlagProsessIndex rendrer beregningFP', () => {
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    beregningsgrunnlag.sammenligningsgrunnlagPrStatus = [sammenligningsgrunnlagPrStatus];
    const wrapper = shallowWithIntl(
      <BeregningsgrunnlagProsessIndex
        behandling={behandling}
        beregningsgrunnlag={[beregningsgrunnlag]}
        aksjonspunkter={[]}
        submitCallback={sinon.spy}
        isReadOnly={false}
        readOnlySubmitButton={false}
        vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={{}}
        fagsak={{}}
      />,
    );
    const beregningFp = wrapper.find(BeregningFP);
    expect(beregningFp.length).to.equal(1);
  });
});
