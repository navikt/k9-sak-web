import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vedtakResultType from '../../../kodeverk/vedtakResultType';
import { findTilbakekrevingText, findAvslagResultatText } from '../VedtakHelper';
import AvslagsårsakListe from '../AvslagsårsakListe';

export const isNewBehandlingResult = (beregningResultat, originaltBeregningResultat) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

export const isNewAmount = (beregningResultat, originaltBeregningResultat) => {
  if (typeof beregningResultat === 'undefined' || beregningResultat === null) {
    return false;
  }
  return beregningResultat.antallBarn !== originaltBeregningResultat.antallBarn;
};

const resultText = (beregningResultat, originaltBeregningResultat) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat)
    ? 'VedtakForm.Resultat.EndretAntallBarn'
    : 'VedtakForm.Resultat.IngenEndring';
};

export const VedtakAvslagRevurderingPanelImpl = ({
  intl,
  vilkar,
  beregningResultat,
  ytelseTypeKode,
  tilbakekrevingText,
  originaltBeregningResultat,
  alleKodeverk,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
      {(ytelseTypeKode === fagsakYtelseType.FRISINN || ytelseTypeKode === fagsakYtelseType.OMSORGSPENGER) && (
        <Normaltekst>
          {intl.formatMessage({ id: findAvslagResultatText(undefined, ytelseTypeKode) })}
          {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
        </Normaltekst>
      )}
      {ytelseTypeKode !== fagsakYtelseType.FRISINN && ytelseTypeKode !== fagsakYtelseType.OMSORGSPENGER && (
        <Normaltekst>
          {intl.formatMessage({ id: resultText(beregningResultat, originaltBeregningResultat) })}
          {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
        </Normaltekst>
      )}
      <div>
        <VerticalSpacer sixteenPx />
        <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
        <AvslagsårsakListe vilkar={vilkar} getKodeverknavn={getKodeverknavn} />
        <VerticalSpacer sixteenPx />
      </div>
      <VerticalSpacer sixteenPx />
    </div>
  );
};

VedtakAvslagRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  beregningResultat: PropTypes.shape(),
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  originaltBeregningResultat: PropTypes.shape(),
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
};

VedtakAvslagRevurderingPanelImpl.defaultProps = {
  originaltBeregningResultat: undefined,
  beregningResultat: undefined,
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagRevurderingPanelImpl));
