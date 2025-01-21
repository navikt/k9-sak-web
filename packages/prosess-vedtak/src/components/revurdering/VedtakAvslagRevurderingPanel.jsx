import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import vedtakResultType from '../../kodeverk/vedtakResultType';
import AvslagsårsakListe from '../AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from '../VedtakHelper';

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
  tilbakekrevingText = null,
  originaltBeregningResultat,
  alleKodeverk,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <div>
      <Label size="small" as="p">
        {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
      </Label>
      {(ytelseTypeKode === fagsakYtelsesType.FRISINN || ytelseTypeKode === fagsakYtelsesType.OMP) && (
        <BodyShort size="small">
          {intl.formatMessage({ id: findAvslagResultatText(undefined, ytelseTypeKode) })}
          {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
        </BodyShort>
      )}
      {ytelseTypeKode !== fagsakYtelsesType.FRISINN && ytelseTypeKode !== fagsakYtelsesType.OMP && (
        <BodyShort size="small">
          {intl.formatMessage({ id: resultText(beregningResultat, originaltBeregningResultat) })}
          {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
        </BodyShort>
      )}
      <div>
        <VerticalSpacer sixteenPx />
        <Label size="small" as="p">
          {intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}
        </Label>
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

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagRevurderingPanelImpl));
