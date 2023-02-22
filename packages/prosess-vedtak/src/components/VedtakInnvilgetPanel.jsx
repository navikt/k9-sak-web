import { isDelvisInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Label } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { findDelvisInnvilgetResultatText, findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';

export const VedtakInnvilgetPanelImpl = ({ intl, behandlingsresultat, ytelseTypeKode, tilbakekrevingText }) => (
  <>
    <Label size="small" as="p" data-testid="innvilget">
      {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
    </Label>
    <BodyShort size="small">
      {intl.formatMessage({
        id: isDelvisInnvilget(behandlingsresultat.type.kode)
          ? findDelvisInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode)
          : findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode),
      })}
      {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
    </BodyShort>
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
