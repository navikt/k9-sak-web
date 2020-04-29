import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';

const finnSamletBruttoForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  return andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ bruttoPrAar }) => bruttoPrAar)
    .reduce((sum, brutto) => sum + brutto, 0);
};

const lagPeriodeHeader = (fom, originalTom) => {
  let tom = null;
  if (originalTom !== '9999-12-31') {
    tom = originalTom;
  }
  return (
    <FormattedMessage
      id="Beregningsgrunnlag.BeregningTable.Periode"
      key={`fom-tom${fom}${tom}`}
      values={{
        fom: moment(fom).format(DDMMYYYY_DATE_FORMAT),
        tom: tom ? moment(tom).format(DDMMYYYY_DATE_FORMAT) : '',
      }}
    />
  );
};

const statuserDetErSøktOmIPerioden = (bgPeriode, ytelsegrunnlag) => {
  const fom = bgPeriode.beregningsgrunnlagPeriodeFom;
  const tom = bgPeriode.beregningsgrunnlagPeriodeTom;
  const perioder = ytelsegrunnlag.perioderSøktFor;
  return perioder
    ? perioder.filter(periode => !moment(fom).isBefore(periode.fom) && !moment(tom).isAfter(periode.tom))
    : [];
};

const lagBeskrivelseMedBeløpRad = (tekstId, beløp) => {
  return (
    <Row>
      <Column xs="10">
        <FormattedMessage id={tekstId} />
      </Column>
      <Column xs="2">
        <Normaltekst>{formatCurrencyNoKr(beløp)}</Normaltekst>
      </Column>
    </Row>
  );
};

const lagRedusertBGRad = (tekstIdRedusert, beløpÅRedusere, tekstIdLøpende, løpendeBeløp) => {
  const redusert = beløpÅRedusere * 0.8;
  return (
    <>
      <Row>
        <Column xs="10">
          <FormattedMessage id={tekstIdRedusert} />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(redusert)}</Normaltekst>
        </Column>
      </Row>
      {(løpendeBeløp || løpendeBeløp === 0) && (
        <Row>
          <Column xs="10">
            <FormattedMessage id={tekstIdLøpende} />
          </Column>
          <Column xs="2">
            <Normaltekst>{formatCurrencyNoKr(løpendeBeløp)}</Normaltekst>
          </Column>
        </Row>
      )}
    </>
  );
};

const finnBeregningsgrunnlag = (bgperiode, statuserDetErSøktOm, status, inntektstak) => {
  const erSøktForStatusIPerioden = statuserDetErSøktOm.find(periode => periode.statusSøktFor.kode === status);
  if (!erSøktForStatusIPerioden) {
    return null;
  }
  const samletATBrutto = finnSamletBruttoForStatus(
    bgperiode.beregningsgrunnlagPrStatusOgAndel,
    aktivitetStatus.ARBEIDSTAKER,
  );
  const samletBruttoForDenneStatus = finnSamletBruttoForStatus(bgperiode.beregningsgrunnlagPrStatusOgAndel, status);

  let bg = inntektstak - samletATBrutto;
  // Er det søkt om en annen status?
  const annenStatusSøktOm = statuserDetErSøktOm.find(periode => periode.statusSøktFor.kode !== status);
  if (!annenStatusSøktOm) {
    if (bg < samletBruttoForDenneStatus) {
      return bg < 0 ? 0 : bg;
    }
    return samletBruttoForDenneStatus;
  }
  const samletBruttoForAnnenStatus = finnSamletBruttoForStatus(
    bgperiode.beregningsgrunnlagPrStatusOgAndel,
    annenStatusSøktOm.statusSøktFor.kode,
  );
  bg -= samletBruttoForAnnenStatus;
  return bg < 0 ? 0 : bg;
};

const lagPeriodeblokk = (bgperiode, ytelsegrunnlag, originaltInntektstak) => {
  const statuserDetErSøktOm = statuserDetErSøktOmIPerioden(bgperiode, ytelsegrunnlag);
  if (!statuserDetErSøktOm || statuserDetErSøktOm.length < 1) {
    return null;
  }
  const beregningsgrunnlagFL = finnBeregningsgrunnlag(
    bgperiode,
    statuserDetErSøktOm,
    aktivitetStatus.FRILANSER,
    originaltInntektstak,
  );
  const beregningsgrunnlagSN = finnBeregningsgrunnlag(
    bgperiode,
    statuserDetErSøktOm,
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    originaltInntektstak,
  );
  const løpendeInntektFL = ytelsegrunnlag.opplysningerFL ? ytelsegrunnlag.opplysningerFL.oppgittInntekt : null;
  const løpendeInntektSN = ytelsegrunnlag.opplysningerSN ? ytelsegrunnlag.opplysningerSN.oppgittInntekt : null;

  return (
    <>
      {(beregningsgrunnlagFL || beregningsgrunnlagFL === 0) &&
        lagBeskrivelseMedBeløpRad('Beregningsgrunnlag.Frisinn.BeregningsgrunnlagFL', beregningsgrunnlagFL)}
      {(beregningsgrunnlagFL || beregningsgrunnlagFL === 0) &&
        lagRedusertBGRad(
          'Beregningsgrunnlag.Frisinn.BeregningsgrunnlagRedusertFL',
          beregningsgrunnlagFL,
          'Beregningsgrunnlag.Søknad.LøpendeFL',
          løpendeInntektFL,
        )}
      {(beregningsgrunnlagSN || beregningsgrunnlagSN === 0) &&
        lagBeskrivelseMedBeløpRad('Beregningsgrunnlag.Frisinn.BeregningsgrunnlagSN', beregningsgrunnlagSN)}
      {(beregningsgrunnlagSN || beregningsgrunnlagSN === 0) &&
        lagRedusertBGRad(
          'Beregningsgrunnlag.Frisinn.BeregningsgrunnlagRedusertSN',
          beregningsgrunnlagSN,
          'Beregningsgrunnlag.Søknad.LøpendeSN',
          løpendeInntektSN,
        )}
      <Row>
        <Column xs="12" className={beregningStyles.noPaddingRight}>
          <div className={beregningStyles.colDevider} />
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <FormattedMessage id="Beregningsgrunnlag.Resultat.Dagsats" />
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(bgperiode.dagsats)}</Normaltekst>
        </Column>
      </Row>
    </>
  );
};

const BeregningsresultatPeriode = ({ bgperiode, ytelsegrunnlag, inntektstak }) => {
  const statuserDetErSøktOm = statuserDetErSøktOmIPerioden(bgperiode, ytelsegrunnlag);
  if (!statuserDetErSøktOm || statuserDetErSøktOm.length < 1) {
    return null;
  }
  return (
    <div>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="10">
          <Element>
            {lagPeriodeHeader(bgperiode.beregningsgrunnlagPeriodeFom, bgperiode.beregningsgrunnlagPeriodeTom)}
          </Element>
        </Column>
      </Row>
      {lagPeriodeblokk(bgperiode, ytelsegrunnlag, inntektstak)}
    </div>
  );
};
BeregningsresultatPeriode.propTypes = {
  inntektstak: PropTypes.number.isRequired,
  bgperiode: PropTypes.shape().isRequired,
  ytelsegrunnlag: PropTypes.shape().isRequired,
};

export default BeregningsresultatPeriode;
