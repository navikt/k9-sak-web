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
import { finnOppgittInntektForAndelIPeriode } from './FrisinnUtils';

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
  const gjeldendePeriode =
    Array.isArray(perioder) &&
    perioder.find(periode => !moment(fom).isBefore(periode.fom) && !moment(tom).isAfter(periode.tom));
  return gjeldendePeriode ? gjeldendePeriode.frisinnAndeler : [];
};

const lagBeskrivelseMedBeløpRad = (tekstId, beløp) => (
  <Row>
    <Column xs="10">
      <FormattedMessage id={tekstId} />
    </Column>
    <Column xs="2">
      <Normaltekst>{formatCurrencyNoKr(beløp)}</Normaltekst>
    </Column>
  </Row>
);

const lagRedusertBGRad = (tekstIdRedusert, beløpÅRedusere, tekstIdLøpende, løpendeBeløp, gjeldendeDekningsgrad) => {
  const multiplikator = gjeldendeDekningsgrad / 100;
  const redusert = beløpÅRedusere * multiplikator;
  return (
    <>
      <Row>
        <Column xs="10">
          <FormattedMessage id={tekstIdRedusert} values={{ grad: gjeldendeDekningsgrad }} />
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

const finnDekningsgrad = bgPeriodeFom => {
  const fomDato = moment(bgPeriodeFom);
  if (fomDato.isBefore(moment('2020-11-01', 'YYYY-MM-DD'))) {
    return 80;
  }
  return fomDato.isBefore(moment('2022-01-01', 'YYYY-MM-DD')) ? 60 : 70;
};

const lagPeriodeblokk = (bgperiode, ytelsegrunnlag, frilansGrunnlag, næringGrunnlag) => {
  const andelerDetErSøktOm = statuserDetErSøktOmIPerioden(bgperiode, ytelsegrunnlag);
  if (!andelerDetErSøktOm || andelerDetErSøktOm.length < 1) {
    return null;
  }
  const beregningsgrunnlagFL = andelerDetErSøktOm.some(p => p.statusSøktFor === aktivitetStatus.FRILANSER)
    ? frilansGrunnlag
    : null;
  const beregningsgrunnlagSN = andelerDetErSøktOm.some(
    p => p.statusSøktFor === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  )
    ? næringGrunnlag
    : null;

  const løpendeInntektFL = finnOppgittInntektForAndelIPeriode(aktivitetStatus.FRILANSER, bgperiode, ytelsegrunnlag);
  const løpendeInntektSN = finnOppgittInntektForAndelIPeriode(
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    bgperiode,
    ytelsegrunnlag,
  );
  const gjeldendeDekningsgrad = finnDekningsgrad(bgperiode.beregningsgrunnlagPeriodeFom);
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
          gjeldendeDekningsgrad,
        )}
      {erBeløpSatt(beregningsgrunnlagSN) &&
        lagBeskrivelseMedBeløpRad('Beregningsgrunnlag.Frisinn.BeregningsgrunnlagSN', beregningsgrunnlagSN)}
      {erBeløpSatt(beregningsgrunnlagSN) &&
        lagRedusertBGRad(
          'Beregningsgrunnlag.Frisinn.BeregningsgrunnlagRedusertSN',
          beregningsgrunnlagSN,
          'Beregningsgrunnlag.Søknad.LøpendeSN',
          løpendeInntektSN,
          gjeldendeDekningsgrad,
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
