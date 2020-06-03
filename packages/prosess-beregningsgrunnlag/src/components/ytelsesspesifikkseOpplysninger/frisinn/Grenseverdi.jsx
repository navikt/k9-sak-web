import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment/moment';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr, TIDENES_ENDE } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import { finnVisningForStatusIPeriode, erSøktForAndelISøknadsperiodePeriode } from './FrisinnUtils';

const førsteDato = moment('2020-04-01');

const lagGrenseveriPeriode = (originaltInntektstak, annenInntektIkkeSøktFor, utregnetInntektstak) => {
  return (
    <>
      <Row>
        <Column xs="10">
          <FormattedMessage
            id="Beregningsgrunnlag.Frisinn.Inntektstak"
            values={{
              grenseverdi: formatCurrencyNoKr(originaltInntektstak),
              annenInntekt: formatCurrencyNoKr(annenInntektIkkeSøktFor),
            }}
          />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(utregnetInntektstak)}</Normaltekst>
        </Column>
      </Row>
    </>
  );
};

const finnAllePerioderSomSkalVises = bgPerioder => {
  const perioder = [];
  for (let i = 0; i < bgPerioder.length; i += 1) {
    const periode = bgPerioder[i];
    const tom = moment(periode.beregningsgrunnlagPeriodeTom);
    const sisteDatoIMåned = moment(periode.beregningsgrunnlagPeriodeTom).endOf('month');
    if (
      tom.isAfter(førsteDato) &&
      tom.isSame(sisteDatoIMåned, 'day') &&
      periode.beregningsgrunnlagPeriodeTom !== TIDENES_ENDE
    ) {
      perioder.push(periode);
    }
  }
  return perioder;
};

const starterFørISammeMåned = (frisinnPeriode, bgPeriode) => {
  const bgFom = moment(bgPeriode.beregningsgrunnlagPeriodeFom);
  const frisinnFom = moment(frisinnPeriode.fom);
  return bgFom.year() === frisinnFom.year() && bgFom.month() === frisinnFom.month() && frisinnFom.isBefore(bgFom);
};

const lagGrenseverdirad = (bg, bgPeriode) => {
  const frisinnGrunnlag = bg.ytelsesspesifiktGrunnlag;
  const bruttoAT = finnVisningForStatusIPeriode(aktivitetStatus.ARBEIDSTAKER, bg, bgPeriode);
  const originaltInntektstak = bg.grunnbeløp * 6;
  let annenInntektIkkeSøktFor = bruttoAT;
  if (!erSøktForAndelISøknadsperiodePeriode(aktivitetStatus.FRILANSER, bgPeriode, frisinnGrunnlag)) {
    const bruttoFL = finnVisningForStatusIPeriode(aktivitetStatus.FRILANSER, bg, bgPeriode);
    annenInntektIkkeSøktFor += bruttoFL;
  }
  if (!erSøktForAndelISøknadsperiodePeriode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bgPeriode, frisinnGrunnlag)) {
    const bruttoSN = finnVisningForStatusIPeriode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bg, bgPeriode);
    annenInntektIkkeSøktFor += bruttoSN;
  }
  const utregnetInntektstak =
    originaltInntektstak > annenInntektIkkeSøktFor ? originaltInntektstak - annenInntektIkkeSøktFor : 0;

  const tom = bgPeriode.beregningsgrunnlagPeriodeTom;
  const førstePeriodeISammeMåned = frisinnGrunnlag.frisinnPerioder.find(frisinnPeriode =>
    starterFørISammeMåned(frisinnPeriode, bgPeriode),
  );
  const fom = førstePeriodeISammeMåned ? førstePeriodeISammeMåned.fom : bgPeriode.beregningsgrunnlagPeriodeFom;
  return (
    <>
      <Row>
        <Column xs="12">
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage
              id="Beregningsgrunnlag.Frisinn.InntektstakOpplysningerPeriode"
              key={`fom-tom${fom}${tom}`}
              values={{
                fom: moment(fom).format(DDMMYYYY_DATE_FORMAT),
                tom: tom ? moment(tom).format(DDMMYYYY_DATE_FORMAT) : '',
              }}
            />
          </Element>
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      {lagGrenseveriPeriode(originaltInntektstak, annenInntektIkkeSøktFor, utregnetInntektstak)}
      <VerticalSpacer sixteenPx />
    </>
  );
};

const Grenseverdi = ({ beregningsgrunnlag }) => {
  const perioderSomSkalvises = finnAllePerioderSomSkalVises(beregningsgrunnlag.beregningsgrunnlagPeriode);
  return (
    <>
      {perioderSomSkalvises.map(periode => (
        <div key={periode.beregningsgrunnlagPeriodeFom}>{lagGrenseverdirad(beregningsgrunnlag, periode)}</div>
      ))}
    </>
  );
};
Grenseverdi.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Grenseverdi.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Grenseverdi;
