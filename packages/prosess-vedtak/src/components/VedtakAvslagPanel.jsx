import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AvslagsårsakListe from './AvslagsårsakListe';
import { findAvslagResultatText, findTilbakekrevingText } from './VedtakHelper';

export const VedtakAvslagPanelImpl = ({
  intl,
  vilkar,
  behandlingsresultat,
  ytelseTypeKode,
  tilbakekrevingText,
  alleKodeverk,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <div>
      <Undertekst data-testid="avslaatt">{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
      <Normaltekst>
        {intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
        {tilbakekrevingText && `. ${intl.formatMessage({ id: tilbakekrevingText })}`}
      </Normaltekst>
      <VerticalSpacer sixteenPx />

      <div>
        <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
        <AvslagsårsakListe vilkar={vilkar} getKodeverknavn={getKodeverknavn} />
        <VerticalSpacer sixteenPx />
      </div>
    </div>
  );
};

VedtakAvslagPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
};

VedtakAvslagPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagPanelImpl));
