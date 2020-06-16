import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import moment from 'moment';

import { FormattedMessage } from 'react-intl';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import { finnBruttoForStatusIPeriode } from './FrisinnUtils';

const Inntektsopplysninger = ({ beregningsgrunnlag }) => {
  // Vi ønsker alltid kun å vise data fra siste beregnede periode, dvs nest siste periode (koronologisk) i grunnlaget
  if (beregningsgrunnlag.beregningsgrunnlagPeriode.length < 2) {
    return null;
  }
  const kronologiskePerioder = beregningsgrunnlag.beregningsgrunnlagPeriode.sort(
    (a, b) => moment(a.beregningsgrunnlagPeriodeFom) - moment(b.beregningsgrunnlagPeriodeFom),
  );
  const gjeldendePeriode = kronologiskePerioder[kronologiskePerioder.length - 2];
  const bruttoSN = finnBruttoForStatusIPeriode(
    aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    beregningsgrunnlag,
    gjeldendePeriode,
  );
  const bruttoFL = finnBruttoForStatusIPeriode(aktivitetStatus.FRILANSER, beregningsgrunnlag, gjeldendePeriode);
  const bruttoAT = finnBruttoForStatusIPeriode(aktivitetStatus.ARBEIDSTAKER, beregningsgrunnlag, gjeldendePeriode);
  return (
    <div>
      <Row>
        <Column xs="12">
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.Søknad.Inntektsopplysninger" />
          </Element>
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektAT" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Element>{formatCurrencyNoKr(bruttoAT)}</Element>
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektFL" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Element>{formatCurrencyNoKr(bruttoFL)}</Element>
        </Column>
      </Row>
      <Row>
        <Column xs="10">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.InntektSN" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Element>{formatCurrencyNoKr(bruttoSN)}</Element>
        </Column>
      </Row>
    </div>
  );
};
Inntektsopplysninger.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Inntektsopplysninger.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Inntektsopplysninger;
