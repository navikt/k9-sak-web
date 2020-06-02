import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr, TIDENES_ENDE } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import { finnOppgittInntektForAndelIPeriode, erSøktForAndelIPeriode } from './FrisinnUtils';

const lagPeriodeHeader = (fom, originalTom) => {
  let tom = null;
  if (originalTom !== TIDENES_ENDE) {
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
  const perioder = ytelsegrunnlag.frisinnPerioder;
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

const erBeløpSatt = beløp => beløp || beløp === 0;

const lagPeriodeblokk = (bgperiode, ytelsegrunnlag, frilansGrunnlag, næringGrunnlag) => {
  const statuserDetErSøktOm = statuserDetErSøktOmIPerioden(bgperiode, ytelsegrunnlag);
  if (!statuserDetErSøktOm || statuserDetErSøktOm.length < 1) {
    return null;
  }
  const beregningsgrunnlagFL = erSøktForAndelIPeriode(aktivitetStatus.FRILANSER, bgperiode, ytelsegrunnlag)
    ? frilansGrunnlag
    : null;
  const beregningsgrunnlagSN = erSøktForAndelIPeriode(
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    bgperiode,
    ytelsegrunnlag,
  )
    ? næringGrunnlag
    : null;

  const løpendeInntektFL = finnOppgittInntektForAndelIPeriode(aktivitetStatus.FRILANSER, bgperiode, ytelsegrunnlag);
  const løpendeInntektSN = finnOppgittInntektForAndelIPeriode(
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    bgperiode,
    ytelsegrunnlag,
  );

  return (
    <>
      {erBeløpSatt(beregningsgrunnlagFL) &&
        lagBeskrivelseMedBeløpRad('Beregningsgrunnlag.Frisinn.BeregningsgrunnlagFL', beregningsgrunnlagFL)}
      {erBeløpSatt(beregningsgrunnlagFL) &&
        lagRedusertBGRad(
          'Beregningsgrunnlag.Frisinn.BeregningsgrunnlagRedusertFL',
          beregningsgrunnlagFL,
          'Beregningsgrunnlag.Søknad.LøpendeFL',
          løpendeInntektFL,
        )}
      {erBeløpSatt(beregningsgrunnlagSN) &&
        lagBeskrivelseMedBeløpRad('Beregningsgrunnlag.Frisinn.BeregningsgrunnlagSN', beregningsgrunnlagSN)}
      {erBeløpSatt(beregningsgrunnlagSN) &&
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
          <Undertittel>
            <FormattedMessage id="Beregningsgrunnlag.Resultat.Dagsats" />
          </Undertittel>
        </Column>
        <Column xs="2">
          <Normaltekst>{formatCurrencyNoKr(bgperiode.dagsats)}</Normaltekst>
        </Column>
      </Row>
    </>
  );
};

const BeregningsresultatPeriode = ({ bgperiode, ytelsegrunnlag, frilansGrunnlag, næringGrunnlag }) => {
  const statuserDetErSøktOm = statuserDetErSøktOmIPerioden(bgperiode, ytelsegrunnlag);
  if (!statuserDetErSøktOm || statuserDetErSøktOm.length < 1) {
    return null;
  }
  const visningFrilans = frilansGrunnlag >= 0 ? frilansGrunnlag : 0;
  const visningNæring = næringGrunnlag >= 0 ? næringGrunnlag : 0;
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
      {lagPeriodeblokk(bgperiode, ytelsegrunnlag, visningFrilans, visningNæring)}
    </div>
  );
};
BeregningsresultatPeriode.propTypes = {
  bgperiode: PropTypes.shape().isRequired,
  ytelsegrunnlag: PropTypes.shape().isRequired,
  frilansGrunnlag: PropTypes.number,
  næringGrunnlag: PropTypes.number,
};

BeregningsresultatPeriode.defaultProps = {
  frilansGrunnlag: undefined,
  næringGrunnlag: undefined,
};

export default BeregningsresultatPeriode;
