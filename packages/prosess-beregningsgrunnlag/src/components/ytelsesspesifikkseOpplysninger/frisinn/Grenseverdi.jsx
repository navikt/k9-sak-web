import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment/moment';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import PropTypes from 'prop-types';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import {
  erSøktForAndelISøknadsperiode,
  finnBruttoForStatusIPeriode,
  finnAlleBGPerioderÅViseDetaljerFor,
} from './FrisinnUtils';

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

/**
 */

const starterFørISammeMåned = (frisinnPeriode, bgPeriode) => {
  const bgFom = moment(bgPeriode.beregningsgrunnlagPeriodeFom);
  const frisinnFom = moment(frisinnPeriode.fom);
  return bgFom.year() === frisinnFom.year() && bgFom.month() === frisinnFom.month() && frisinnFom.isBefore(bgFom);
};

const lagGrenseverdirad = (bg, bgPeriode) => {
  const frisinnGrunnlag = bg.ytelsesspesifiktGrunnlag;
  const bruttoAT = finnBruttoForStatusIPeriode(aktivitetStatus.ARBEIDSTAKER, bg, bgPeriode);
  const originaltInntektstak = bg.grunnbeløp * 6;
  let annenInntektIkkeSøktFor = bruttoAT;
  if (!erSøktForAndelISøknadsperiode(aktivitetStatus.FRILANSER, bgPeriode, frisinnGrunnlag)) {
    const bruttoFL = finnBruttoForStatusIPeriode(aktivitetStatus.FRILANSER, bg, bgPeriode);
    annenInntektIkkeSøktFor += bruttoFL;
  }
  if (!erSøktForAndelISøknadsperiode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bgPeriode, frisinnGrunnlag)) {
    const bruttoSN = finnBruttoForStatusIPeriode(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, bg, bgPeriode);
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
/**
 * Vi ønsker å vise en rad for grenseverdi pr måned det er søkt ytelse for.
 * Om det er søkt to perioder i en måned skal disse vises som en rad der vi tar utgangspunkt i den siste, fordi denne alltid
 * vil vare ut måneden.
 */
const Grenseverdi = ({ beregningsgrunnlag, behandlingÅrsaker }) => {
  const perioderSomSkalvises = finnAlleBGPerioderÅViseDetaljerFor(
    beregningsgrunnlag.beregningsgrunnlagPeriode,
    beregningsgrunnlag.ytelsesspesifiktGrunnlag,
    behandlingÅrsaker,
  );
  return (
    <>
      {perioderSomSkalvises.map(periode => (
        <div key={periode.beregningsgrunnlagPeriodeFom}>{lagGrenseverdirad(beregningsgrunnlag, periode)}</div>
      ))}
    </>
  );
};
Grenseverdi.propTypes = {
  behandlingÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Grenseverdi.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Grenseverdi;
