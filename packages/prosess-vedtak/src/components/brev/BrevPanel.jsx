import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { formValueSelector, reduxForm } from 'redux-form';
import styles from './BrevPanel.less';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';
import FritekstBrevPanel from '../FritekstBrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';

const kanResultatForhåndsvises = behandlingResultat => {
  if (!behandlingResultat) {
    return true;
  }
  const { type } = behandlingResultat;
  if (!type) {
    return true;
  }
  return type.kode !== 'ENDRING_I_FORDELING_AV_YTELSEN' && type.kode !== 'INGEN_ENDRING';
};

export const BrevPanel = props => {
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
    redusertUtbetalingÅrsaker,
    brødtekst,
    overskrift,
    behandlingResultat,
  } = props;

  const isTilgjengeligeVedtaksbrevArray = Array.isArray(tilgjengeligeVedtaksbrev);
  const kanHaFritekstbrev = !isTilgjengeligeVedtaksbrevArray || tilgjengeligeVedtaksbrev.some(vb => vb === 'FRITEKST');
  const harTilgjengeligeVedtaksbrev = !isTilgjengeligeVedtaksbrevArray || !!tilgjengeligeVedtaksbrev.length;
  const skalKunneForhåndsviseAutomatiskBrev = kanResultatForhåndsvises(behandlingResultat);

  const getPreviewAutomatiskBrevCallback = fritekst => e => {
    previewCallback({
      dokumentdata: { fritekst: fritekst || ' ', redusertUtbetalingÅrsaker },
      dokumentMal: dokumentMalType.UTLED,
    });
    e.preventDefault();
  };

  const getManuellBrevCallback = () => e => {
    previewCallback({
      dokumentdata: { fritekstbrev: { brødtekst: brødtekst || ' ', overskrift: overskrift || ' ' } },
      dokumentMal: dokumentMalType.FRITKS,
    });
    e.preventDefault();
  };

  const previewAutomatiskBrev = getPreviewAutomatiskBrevCallback(begrunnelse);
  const previewManuellBrev = getManuellBrevCallback();

  return (
    <div>
      {harTilgjengeligeVedtaksbrev ? (
        <>
          {!skalBrukeOverstyrendeFritekstBrev ? (
            <>
              <InformasjonsbehovAutomatiskVedtaksbrev
                intl={intl}
                readOnly={readOnly}
                sprakkode={sprakkode}
                beregningErManueltFastsatt={beregningErManueltFastsatt}
                begrunnelse={begrunnelse}
                dokumentdata={dokumentdata}
              />
              {skalKunneForhåndsviseAutomatiskBrev && <VedtakPreviewLink previewCallback={previewAutomatiskBrev} />}
            </>
          ) : (
            kanHaFritekstbrev && (
              <>
                <FritekstBrevPanel readOnly={readOnly} sprakkode={sprakkode} previewBrev={previewAutomatiskBrev} />
                <VedtakPreviewLink previewCallback={previewManuellBrev} />
              </>
            )
          )}
        </>
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
  redusertUtbetalingÅrsaker: PropTypes.arrayOf(PropTypes.string),
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  behandlingResultat: PropTypes.shape(),
};

BrevPanel.defaultProps = {
  tilgjengeligeVedtaksbrev: undefined,
  begrunnelse: null,
  brødtekst: null,
  overskrift: null,
};

export const brevselector = createSelector(
  [ownProps => ownProps.sprakkode, ownProps => ownProps.vedtakVarsel, ownProps => ownProps.dokumentdata],
  (sprakkode, vedtakVarsel, dokumentdata) => ({
    sprakkode,
    begrunnelse: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
  }),
);

const mapStateToPropsFactory = () => {
  return (state, ownProps) => ({
    ...brevselector(ownProps),
    brødtekst: formValueSelector('brevPanel')(state, 'brødtekst'),
    overskrift: formValueSelector('brevPanel')(state, 'overskrift'),
    begrunnelse: formValueSelector('brevPanel')(state, 'begrunnelse'),
  });
};

export default connect(mapStateToPropsFactory)(
  reduxForm({
    form: 'brevPanel',
  })(injectIntl(BrevPanel)),
);
