import { isDelvisInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Label } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { findDelvisInnvilgetResultatText, findInnvilgetResultatText, findTilbakekrevingText } from './VedtakHelper';

export const VedtakInnvilgetPanelImpl = ({ intl, behandlingsresultat, ytelseTypeKode, tilbakekrevingText = null }) => (
  <>
    <Label size="small" as="p" data-testid="innvilget">
      {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
    </Label>
    <BodyShort size="small">
      {intl.formatMessage({
        id: isDelvisInnvilget(behandlingsresultat.type)
          ? findDelvisInnvilgetResultatText(behandlingsresultat.type, ytelseTypeKode)
          : findInnvilgetResultatText(behandlingsresultat.type, ytelseTypeKode),
      })}
      {tilbakekrevingText && `. ${tilbakekrevingText}`}
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

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(VedtakInnvilgetPanelImpl);
