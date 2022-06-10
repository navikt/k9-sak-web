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
import {
  erSøktForAndelISøknadsperiode,
  finnBruttoForStatusIPeriode,
  finnFrisinnperioderSomSkalVises,
} from './FrisinnUtils';
import beregningsgrunnlagBehandlingPropType from '../../../propTypes/beregningsgrunnlagBehandlingPropType';

const førsteDato = moment('2020-04-01');

const lagGrenseveriPeriode = (originaltInntektstak, annenInntektIkkeSøktFor, utregnetInntektstak) => (
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
);

const overlapperMedFrisinnPeriode = (bgPeriode, frisinnPerioder) => {
  if (!Array.isArray(frisinnPerioder)) {
    return false;
  }
  const bgFom = moment(bgPeriode.beregningsgrunnlagPeriodeFom);
  const bgTom = moment(bgPeriode.beregningsgrunnlagPeriodeTom);
  return frisinnPerioder.some(p => !moment(p.fom).isBefore(bgFom) && !moment(p.tom).isAfter(bgTom));
};

/**
 * Henter kun ut perioder som avsluttes på siste dag i en måned, da dette er de som skal vises for FRISINN.
 * De må også overlappe med frisinnperiode
 * De får rett startdato senere
 */
const finnAllePerioderSomSkalVises = (bgPerioder, frisinnperioder) => {
  const perioder = [];
  if (Array.isArray(bgPerioder)) {
    bgPerioder.forEach(periode => {
      if (overlapperMedFrisinnPeriode(periode, frisinnperioder)) {
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
    });
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
  const førstePeriodeISammeMåned =
    Array.isArray(frisinnGrunnlag.frisinnPerioder) &&
    frisinnGrunnlag.frisinnPerioder.find(frisinnPeriode => starterFørISammeMåned(frisinnPeriode, bgPeriode));
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
const Grenseverdi = ({ beregningsgrunnlag, behandling }) => {
  const relevanteFrisinnperioder = finnFrisinnperioderSomSkalVises(beregningsgrunnlag, behandling);
  const perioderSomSkalvises = finnAllePerioderSomSkalVises(
    beregningsgrunnlag.beregningsgrunnlagPeriode,
    relevanteFrisinnperioder,
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
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  behandling: beregningsgrunnlagBehandlingPropType.isRequired,
};

export default Grenseverdi;
