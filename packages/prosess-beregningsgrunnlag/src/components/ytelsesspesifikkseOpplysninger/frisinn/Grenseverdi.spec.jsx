import { expect } from 'chai';
import { shallow } from 'enzyme';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import React from 'react';
import moment from 'moment';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import Grenseverdi from './Grenseverdi';

const seksG = 599148;

const lagBgPeriode = (fom, tom, andeler) => ({
  beregningsgrunnlagPeriodeFom: fom,
  beregningsgrunnlagPeriodeTom: tom,
  beregningsgrunnlagPrStatusOgAndel: andeler,
});

const lagFrisinnAndel = (status, beløp) => ({
  oppgittInntekt: beløp,
  statusSøktFor: status,
});

const lagFrisinnPeriode = (fom, tom, frisinnAndeler) => ({
  fom,
  tom,
  frisinnAndeler,
});

const lagFrisinngrunnlag = frisinnPerioder => ({
  frisinnPerioder,
});

const lagBGAndel = (status, brutto) => ({
  aktivitetStatus: status,
  bruttoPrAar: brutto,
});

const lagBG = (perioder, frisinn) => ({
  grunnbeløp: 99858,
  beregningsgrunnlagPeriode: perioder,
  ytelsesspesifiktGrunnlag: frisinn,
});

const formaterDato = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

const lagForventetVerdiOverskrift = (dato1, dato2) => ({
  fom: formaterDato(dato1),
  tom: formaterDato(dato2),
});

const lagForventetVerdiRegnestykke = (originaltInntektstak, annenInntektIkkeSøktFor) => ({
  grenseverdi: formatCurrencyNoKr(originaltInntektstak),
  annenInntekt: formatCurrencyNoKr(annenInntektIkkeSøktFor),
});

const behandling = {
  id: 1,
  versjon: 1,
  behandlingÅrsaker: [],
  sprakkode: 'NB',
};

describe('<Grenseverdi>', () => {
  it('Skal vise en rad når det søkes om ytelse for en måned og ingen arbeidsinntekt', () => {
    const frisinnAndeler = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const frisinnPerioder = [lagFrisinnPeriode('2020-04-01', '2020-04-30', frisinnAndeler)];
    const frisinnGrunnlag = lagFrisinngrunnlag(frisinnPerioder);
    const bgAndeler = [lagBGAndel(aktivitetStatus.FRILANSER, 200000)];
    const bgPerioder = [lagBgPeriode('2020-04-01', '2020-04-30', bgAndeler)];
    const bg = lagBG(bgPerioder, frisinnGrunnlag);
    const wrapper = shallow(<Grenseverdi beregningsgrunnlag={bg} behandling={behandling} />);

    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);

    const overskrift = rows.at(0).find('MemoizedFormattedMessage');
    expect(overskrift.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.InntektstakOpplysningerPeriode');
    expect(overskrift.get(0).props.values).is.deep.equal(lagForventetVerdiOverskrift('2020-04-01', '2020-04-30'));

    const regnestykke = rows.at(1).find('MemoizedFormattedMessage');
    expect(regnestykke.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.Inntektstak');
    expect(regnestykke.get(0).props.values).is.deep.equal(lagForventetVerdiRegnestykke(seksG, 0));
  });
  it('Skal ikke vise en rad for perioder det ikke er søkt om', () => {
    const frisinnAndeler = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const frisinnPerioder = [lagFrisinnPeriode('2020-04-01', '2020-04-30', frisinnAndeler)];
    const frisinnGrunnlag = lagFrisinngrunnlag(frisinnPerioder);
    const bgAndeler = [lagBGAndel(aktivitetStatus.FRILANSER, 200000)];
    const bgPerioder = [
      lagBgPeriode('2020-04-01', '2020-04-30', bgAndeler),
      lagBgPeriode('2020-05-01', '2020-05-31', bgAndeler),
    ];
    const bg = lagBG(bgPerioder, frisinnGrunnlag);
    const wrapper = shallow(<Grenseverdi beregningsgrunnlag={bg} behandling={behandling} />);

    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);

    const overskrift = rows.at(0).find('MemoizedFormattedMessage');
    expect(overskrift.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.InntektstakOpplysningerPeriode');
    expect(overskrift.get(0).props.values).is.deep.equal(lagForventetVerdiOverskrift('2020-04-01', '2020-04-30'));

    const regnestykke = rows.at(1).find('MemoizedFormattedMessage');
    expect(regnestykke.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.Inntektstak');
    expect(regnestykke.get(0).props.values).is.deep.equal(lagForventetVerdiRegnestykke(seksG, 0));
  });
  it('Skal vise en rad når det søkes om ytelse for en måned med arbeidsinntekt', () => {
    const frisinnAndeler = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const frisinnPerioder = [lagFrisinnPeriode('2020-04-01', '2020-04-30', frisinnAndeler)];
    const frisinnGrunnlag = lagFrisinngrunnlag(frisinnPerioder);
    const bgAndeler = [lagBGAndel(aktivitetStatus.FRILANSER, 200000), lagBGAndel(aktivitetStatus.ARBEIDSTAKER, 300000)];
    const bgPerioder = [lagBgPeriode('2020-04-01', '2020-04-30', bgAndeler)];
    const bg = lagBG(bgPerioder, frisinnGrunnlag);
    const wrapper = shallow(<Grenseverdi beregningsgrunnlag={bg} behandling={behandling} />);

    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);

    const overskrift = rows.at(0).find('MemoizedFormattedMessage');
    expect(overskrift.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.InntektstakOpplysningerPeriode');
    expect(overskrift.get(0).props.values).is.deep.equal(lagForventetVerdiOverskrift('2020-04-01', '2020-04-30'));

    const regnestykke = rows.at(1).find('MemoizedFormattedMessage');
    expect(regnestykke.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.Inntektstak');
    expect(regnestykke.get(0).props.values).is.deep.equal(lagForventetVerdiRegnestykke(seksG, 300000));
  });
  it('Skal vise en rad når det søkes om ytelse for en måned med arbeidsinntekt og måneden er delt i to', () => {
    const frisinnAndeler1 = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const frisinnAndeler2 = [
      lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000),
      lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000),
    ];
    const frisinnPerioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-19', frisinnAndeler1),
      lagFrisinnPeriode('2020-04-20', '2020-04-30', frisinnAndeler2),
    ];
    const frisinnGrunnlag = lagFrisinngrunnlag(frisinnPerioder);
    const bgAndeler = [lagBGAndel(aktivitetStatus.FRILANSER, 200000), lagBGAndel(aktivitetStatus.ARBEIDSTAKER, 300000)];
    const bgPerioder = [
      lagBgPeriode('2020-04-01', '2020-04-19', bgAndeler),
      lagBgPeriode('2020-04-20', '2020-04-30', bgAndeler),
    ];
    const bg = lagBG(bgPerioder, frisinnGrunnlag);
    const wrapper = shallow(<Grenseverdi beregningsgrunnlag={bg} behandling={behandling} />);

    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);

    const overskrift = rows.at(0).find('MemoizedFormattedMessage');
    expect(overskrift.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.InntektstakOpplysningerPeriode');
    expect(overskrift.get(0).props.values).is.deep.equal(lagForventetVerdiOverskrift('2020-04-01', '2020-04-30'));

    const regnestykke = rows.at(1).find('MemoizedFormattedMessage');
    expect(regnestykke.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.Inntektstak');
    expect(regnestykke.get(0).props.values).is.deep.equal(lagForventetVerdiRegnestykke(seksG, 300000));
  });
  it('Skal vise to rader når det søkes om ytelse med arbeidsinntekt i en måned', () => {
    const frisinnAndeler1 = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const frisinnAndeler2 = [
      lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000),
      lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000),
    ];
    const frisinnPerioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-19', frisinnAndeler1),
      lagFrisinnPeriode('2020-04-20', '2020-04-30', frisinnAndeler2),
      lagFrisinnPeriode('2020-05-01', '2020-05-31', frisinnAndeler2),
    ];
    const frisinnGrunnlag = lagFrisinngrunnlag(frisinnPerioder);
    const bgAndeler = [lagBGAndel(aktivitetStatus.FRILANSER, 200000), lagBGAndel(aktivitetStatus.ARBEIDSTAKER, 300000)];
    const bgPerioder = [
      lagBgPeriode('2020-04-01', '2020-04-19', bgAndeler),
      lagBgPeriode('2020-04-20', '2020-04-30', bgAndeler),
      lagBgPeriode('2020-05-01', '2020-05-31', bgAndeler),
    ];
    const bg = lagBG(bgPerioder, frisinnGrunnlag);
    const wrapper = shallow(<Grenseverdi beregningsgrunnlag={bg} behandling={behandling} />);

    const rows = wrapper.find('Row');
    expect(rows).to.have.length(4);

    const overskrift = rows.at(0).find('MemoizedFormattedMessage');
    expect(overskrift.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.InntektstakOpplysningerPeriode');
    expect(overskrift.get(0).props.values).is.deep.equal(lagForventetVerdiOverskrift('2020-04-01', '2020-04-30'));

    const regnestykke = rows.at(1).find('MemoizedFormattedMessage');
    expect(regnestykke.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.Inntektstak');
    expect(regnestykke.get(0).props.values).is.deep.equal(lagForventetVerdiRegnestykke(seksG, 300000));

    const overskrift2 = rows.at(2).find('MemoizedFormattedMessage');
    expect(overskrift2.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.InntektstakOpplysningerPeriode');
    expect(overskrift2.get(0).props.values).is.deep.equal(lagForventetVerdiOverskrift('2020-05-01', '2020-05-31'));

    const regnestykke2 = rows.at(3).find('MemoizedFormattedMessage');
    expect(regnestykke2.get(0).props.id).to.equal('Beregningsgrunnlag.Frisinn.Inntektstak');
    expect(regnestykke2.get(0).props.values).is.deep.equal(lagForventetVerdiRegnestykke(seksG, 300000));
  });
});
