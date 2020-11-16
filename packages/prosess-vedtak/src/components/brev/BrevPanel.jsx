import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';
import FritekstBrevPanel from '../FritekstBrevPanel';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';

const BrevPanel = props => {
  const {
    intl,
    readOnly,
    sprakkode,
    vedtakVarsel,
    beregningErManueltFastsatt,
    dokumentdata,
    tilgjengeligeVedtaksbrev,
    skalBrukeOverstyrendeFritekstBrev,
    begrunnelse,
    previewCallback,
  } = props;

  const isTilgjengeligeVedtaksbrevArray = Array.isArray(tilgjengeligeVedtaksbrev);
  const kanHaFritekstbrev = !isTilgjengeligeVedtaksbrevArray || tilgjengeligeVedtaksbrev.some(vb => vb === 'FRITEKST');
  const harTilgjengeligeVedtaksbrev = !isTilgjengeligeVedtaksbrevArray || !!tilgjengeligeVedtaksbrev.length;

  const AutomatiskVedtaksbrev = () => (
    <>
      <InformasjonsbehovAutomatiskVedtaksbrev
        intl={intl}
        readOnly={readOnly}
        sprakkode={sprakkode}
        vedtakVarsel={vedtakVarsel}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
        dokumentdata={dokumentdata}
      />
    </>
  );

  const getPreviewAutomatiskBrevCallback = fritekst => e => {
    const formValues = {
      fritekst,
      gjelderVedtak: true,
      vedtaksbrev: {
        kode: 'AUTOMATISK',
      },
    };
    previewCallback(formValues);
    e.preventDefault();
  };
  const previewAutomatiskBrev = getPreviewAutomatiskBrevCallback(begrunnelse);

  const Vedtaksbrev = () => (
    <>
      {!skalBrukeOverstyrendeFritekstBrev ? (
        <AutomatiskVedtaksbrev />
      ) : (
        kanHaFritekstbrev && (
          <FritekstBrevPanel readOnly={readOnly} sprakkode={sprakkode} previewBrev={previewAutomatiskBrev} />
        )
      )}
    </>
  );

  return (
    <div>
      {harTilgjengeligeVedtaksbrev ? (
        <Vedtaksbrev />
      ) : (
        <AlertStripeInfo className={styles.infoIkkeVedtaksbrev}>
          {intl.formatMessage({ id: 'VedtakForm.IkkeVedtaksbrev' })}
        </AlertStripeInfo>
      )}
    </div>
  );
};

BrevPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  vedtakVarsel: vedtakVarselPropType,
  dokumentdata: PropTypes.shape(),
  begrunnelse: PropTypes.string,
  tilgjengeligeVedtaksbrev: PropTypes.arrayOf(PropTypes.string),
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
};

BrevPanel.defaultProps = {
  tilgjengeligeVedtaksbrev: undefined,
  dokumentdata: undefined,
  begrunnelse: undefined,
};

export const brevselector = createSelector(
  [ownProps => ownProps.sprakkode, ownProps => ownProps.vedtakVarsel],
  (sprakkode, vedtakVarsel) => ({
    sprakkode,
    begrunnelse: decodeHtmlEntity(vedtakVarsel.fritekst),
  }),
);

const mapStateToProps = (state, ownProps) => {
  return { ...brevselector(ownProps) };
};

export default connect(mapStateToProps)(injectIntl(BrevPanel));
