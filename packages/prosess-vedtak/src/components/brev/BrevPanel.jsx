import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import styles from './BrevPanel.less';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';
import FritekstBrevPanel from '../FritekstBrevPanel';

const BrevPanel = props => {
  const {
    intl,
    readOnly,
    sprakkode,
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

  const AutomatiskVedtaksbrev = () => (
    <>
      <InformasjonsbehovAutomatiskVedtaksbrev
        intl={intl}
        readOnly={readOnly}
        sprakkode={sprakkode}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
        begrunnelse={begrunnelse}
        dokumentdata={dokumentdata}
      />
    </>
  );

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
  dokumentdata: PropTypes.shape().isRequired,
  begrunnelse: PropTypes.string,
  tilgjengeligeVedtaksbrev: PropTypes.arrayOf(PropTypes.string),
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  beregningErManueltFastsatt: PropTypes.bool,
  previewCallback: PropTypes.func.isRequired,
};

BrevPanel.defaultProps = {
  tilgjengeligeVedtaksbrev: undefined,
  begrunnelse: null,
};

export const brevselector = createSelector(
  [ownProps => ownProps.sprakkode, ownProps => ownProps.vedtakVarsel, ownProps => ownProps.dokumentdata],
  (sprakkode, vedtakVarsel, dokumentdata) => ({
    sprakkode,
    begrunnelse: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
  }),
);

const mapStateToProps = (state, ownProps) => {
  return { ...brevselector(ownProps) };
};

export default connect(mapStateToProps)(injectIntl(BrevPanel));
