import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import VedtakFritekstPanel from './VedtakFritekstPanel';
import { findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';
import vedtakVarselPropType from '../propTypes/vedtakVarselPropType';

export const VedtakInnvilgetPanelImpl = ({
  intl,
  behandlingsresultat,
  ytelseTypeKode,
  sprakkode,
  readOnly,
  skalBrukeOverstyrendeFritekstBrev,
  tilbakekrevingText,
  beregningErManueltFastsatt,
  vedtakVarsel,
}) => (
  <>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({ id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
      {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
    </Normaltekst>
    <VerticalSpacer eightPx />
    {beregningErManueltFastsatt && !skalBrukeOverstyrendeFritekstBrev && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
        vedtakVarsel={vedtakVarsel}
      />
    )}
  </>
);

VedtakInnvilgetPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  sprakkode: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  tilbakekrevingText: PropTypes.string,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
  vedtakVarsel: vedtakVarselPropType,
};

VedtakInnvilgetPanelImpl.defaultProps = {
  sprakkode: undefined,
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
