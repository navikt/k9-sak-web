import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import moment from 'moment';
import beregningStyles from '../../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';

const søkerYtelseFor = (ytelsegrunnlag, status) =>
  ytelsegrunnlag.perioderSøktFor.find(periode => periode.statusSøktFor.kode === status);

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
              <FormattedMessage
                id="Beregningsgrunnlag.Søknad.SøktYtelseFL"
                values={{
                  fom: moment(søktYtelseFL.fom).format(DDMMYYYY_DATE_FORMAT),
                  tom: moment(søktYtelseFL.yom).format(DDMMYYYY_DATE_FORMAT),
                }}
              />
            </Normaltekst>
          </Column>
        </Row>
      )}
      {søktYtelseSN && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage
                id="Beregningsgrunnlag.Søknad.SøktYtelseSN"
                values={{
                  fom: moment(søktYtelseSN.fom).format(DDMMYYYY_DATE_FORMAT),
                  tom: moment(søktYtelseSN.yom).format(DDMMYYYY_DATE_FORMAT),
                }}
              />
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
