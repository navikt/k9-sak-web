import { expect } from 'chai';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import Panel, { brukersAndelFieldArrayName } from './FastsettBgKunYtelse';

const { FASTSETT_BG_KUN_YTELSE } = faktaOmBeregningTilfelle;
const faktaOmBeregningAndel1 = {
  andelsnr: 1,
  fastsattBelopPrMnd: null,
  lagtTilAvSaksbehandler: false,
  inntektskategori: inntektskategorier.UDEFINERT,
  aktivitetStatus: 'BA',
};
const faktaOmBeregningAndel2 = {
  andelsnr: 2,
  fastsattBelopPrMnd: 10000,
  lagtTilAvSaksbehandler: true,
  inntektskategori: inntektskategorier.ARBEIDSTAKER,
  aktivitetStatus: 'BA',
};
const faktaOmBeregningAndeler = [faktaOmBeregningAndel1, faktaOmBeregningAndel2];
describe('<KunYtelsePanel>', () => {
  it('skal transform values riktig', () => {
    const andel1 = {
      andelsnr: 1,
      nyAndel: false,
      lagtTilAvSaksbehandler: false,
      fastsattBelop: '10 000',
      inntektskategori: inntektskategorier.ARBEIDSTAKER,
    };
    const andel2 = {
      andelsnr: null,
      nyAndel: true,
      lagtTilAvSaksbehandler: true,
      fastsattBelop: '20 000',
      inntektskategori: inntektskategorier.SJØMANN,
    };
    const values = {};
    values[`${brukersAndelFieldArrayName}`] = [andel1, andel2];
    const transformedValues = Panel.transformValues(values, [FASTSETT_BG_KUN_YTELSE]);
    expect(transformedValues.kunYtelseFordeling.andeler).to.have.length(2);
    expect(transformedValues.kunYtelseFordeling.andeler[0].andelsnr).to.equal(1);
    expect(transformedValues.kunYtelseFordeling.andeler[0].fastsattBeløp).to.equal(10000);
    expect(transformedValues.kunYtelseFordeling.andeler[0].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(transformedValues.kunYtelseFordeling.andeler[0].nyAndel).to.equal(false);
    expect(transformedValues.kunYtelseFordeling.andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(transformedValues.kunYtelseFordeling.andeler[1].andelsnr).to.equal(null);
    expect(transformedValues.kunYtelseFordeling.andeler[1].fastsattBeløp).to.equal(20000);
    expect(transformedValues.kunYtelseFordeling.andeler[1].inntektskategori).to.equal(inntektskategorier.SJØMANN);
    expect(transformedValues.kunYtelseFordeling.andeler[1].nyAndel).to.equal(true);
    expect(transformedValues.kunYtelseFordeling.andeler[1].lagtTilAvSaksbehandler).to.equal(true);
  });
  it('skal bygge initial values', () => {
    const andel1 = {
      andelsnr: 1,
      fastsattBelopPrMnd: null,
      lagtTilAvSaksbehandler: false,
      inntektskategori: inntektskategorier.UDEFINERT,
      aktivitetStatus: 'BA',
    };
    const andel2 = {
      andelsnr: 2,
      fastsattBelopPrMnd: 10000,
      lagtTilAvSaksbehandler: true,
      inntektskategori: inntektskategorier.ARBEIDSTAKER,
      aktivitetStatus: 'BA',
    };
    const kunYtelse = {
      andeler: [andel1, andel2],
    };
    const initialValues = Panel.buildInitialValues(kunYtelse, [FASTSETT_BG_KUN_YTELSE], faktaOmBeregningAndeler);
    const andeler = initialValues[`${brukersAndelFieldArrayName}`];
    expect(andeler).to.have.length(2);
    expect(andeler[0].andelsnr).to.equal(1);
    expect(andeler[0].andel).to.equal('Ytelse');
    expect(andeler[0].aktivitetStatus).to.equal('BA');
    expect(andeler[0].fastsattBelop).to.equal('');
    expect(andeler[0].inntektskategori).to.equal('');
    expect(andeler[0].nyAndel).to.equal(false);
    expect(andeler[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(andeler[1].andelsnr).to.equal(2);
    expect(andeler[1].andel).to.equal('Ytelse');
    expect(andeler[1].fastsattBelop).to.equal('10 000');
    expect(andeler[1].aktivitetStatus).to.equal('BA');
    expect(andeler[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(andeler[1].nyAndel).to.equal(false);
    expect(andeler[1].lagtTilAvSaksbehandler).to.equal(true);
  });
});
