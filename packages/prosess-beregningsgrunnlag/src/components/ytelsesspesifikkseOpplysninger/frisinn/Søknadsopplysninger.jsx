import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';

const søkerYtelseFor = (ytelsegrunnlag, status) =>
  ytelsegrunnlag.perioderSøktFor.some(periode => periode.statusSøktFor.kode === status);

const Søknadsopplysninger = ({ beregningsgrunnlag }) => {
  const ytelsegrunnlag = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  const søktYtelseFL = søkerYtelseFor(ytelsegrunnlag, aktivitetStatus.FRILANSER);
  const søktYtelseSN = søkerYtelseFor(ytelsegrunnlag, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const flOpplysninger = beregningsgrunnlag.ytelsesspesifiktGrunnlag.opplysningerFL;
  const snOpplysninger = beregningsgrunnlag.ytelsesspesifiktGrunnlag.opplysningerSN;
  return (
    <div>
      <Row>
        <Column xs="12">
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.Søknad.Tittel" />
          </Element>
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      {søktYtelseFL && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Søknad.SøktYtelseFL" />
            </Normaltekst>
          </Column>
        </Row>
      )}
      {søktYtelseSN && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Søknad.SøktYtelseSN" />
            </Normaltekst>
          </Column>
        </Row>
      )}
      <VerticalSpacer sixteenPx />
      {flOpplysninger && flOpplysninger.erNyoppstartet && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Søknad.NyoppstartetFL" />
            </Normaltekst>
          </Column>
        </Row>
      )}
      {snOpplysninger && snOpplysninger.erNyoppstartet && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Søknad.NyoppstartetSN" />
            </Normaltekst>
          </Column>
          <VerticalSpacer eightPx />
        </Row>
      )}
      <VerticalSpacer sixteenPx />
      {flOpplysninger && (
        <Row>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Søknad.LøpendeFL" />
            </Normaltekst>
          </Column>
          <Column xs="3">
            <Element>{formatCurrencyNoKr(flOpplysninger.oppgittÅrsinntekt)}</Element>
          </Column>
        </Row>
      )}
      {snOpplysninger && (
        <Row>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Søknad.LøpendeSN" />
            </Normaltekst>
          </Column>
          <Column xs="3">
            <Element>{formatCurrencyNoKr(snOpplysninger.oppgittÅrsinntekt)}</Element>
          </Column>
        </Row>
      )}
    </div>
  );
};
Søknadsopplysninger.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Søknadsopplysninger.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Søknadsopplysninger;
