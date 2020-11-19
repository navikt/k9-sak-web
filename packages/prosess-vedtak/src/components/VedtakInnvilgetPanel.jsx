import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';

export const VedtakInnvilgetPanelImpl = ({ intl, behandlingsresultat, ytelseTypeKode, tilbakekrevingText }) => (
  <>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({ id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
      {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
    </Normaltekst>
    <VerticalSpacer eightPx />
  </>
);

VedtakInnvilgetPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  tilbakekrevingText: PropTypes.string,
};

VedtakInnvilgetPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
