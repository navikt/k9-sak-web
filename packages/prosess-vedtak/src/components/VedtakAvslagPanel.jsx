import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Label } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AvslagsårsakListe from './AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from './VedtakHelper';

export const VedtakAvslagPanelImpl = ({ intl, vilkar, behandlingsresultat, ytelseTypeKode, tilbakekrevingText }) => (
  <div>
    <Label size="small" as="p" data-testid="avslaatt">
      {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
    </Label>
    <BodyShort size="small">
      {intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type, ytelseTypeKode) })}
      {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
    </BodyShort>
    <VerticalSpacer sixteenPx />

    <div>
      <Label size="small" as="p">
        {intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}
      </Label>
      <AvslagsårsakListe vilkar={vilkar} />
      <VerticalSpacer sixteenPx />
    </div>
  </div>
);

VedtakAvslagPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  tilbakekrevingText: PropTypes.string,
  kodeverkNavnFraKode: PropTypes.func.isRequired,
};

VedtakAvslagPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagPanelImpl));
