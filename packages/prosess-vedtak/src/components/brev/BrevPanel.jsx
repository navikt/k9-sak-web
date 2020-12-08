import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { formValueSelector } from 'redux-form';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
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

  const harTilgjengeligeVedtaksbrev = !Array.isArray(tilgjengeligeVedtaksbrev) || !!tilgjengeligeVedtaksbrev.length;
  const kanHaAutomatiskVedtaksbrev =
    harTilgjengeligeVedtaksbrev && tilgjengeligeVedtaksbrev.some(vb => vb === 'AUTOMATISK');
  const kanHaFritekstbrev = harTilgjengeligeVedtaksbrev && tilgjengeligeVedtaksbrev.some(vb => vb === 'FRITEKST');

  const fritekstbrev = kanHaFritekstbrev && (
    <>
      <FritekstBrevPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        previewBrev={getPreviewAutomatiskBrevCallback(begrunnelse)}
        harAutomatiskVedtaksbrev={kanHaAutomatiskVedtaksbrev}
      />
      <VedtakPreviewLink previewCallback={getManuellBrevCallback()} />
    </>
  );

  const automatiskbrev = kanHaAutomatiskVedtaksbrev && (
    <>
      <InformasjonsbehovAutomatiskVedtaksbrev
        intl={intl}
        readOnly={readOnly}
        sprakkode={sprakkode}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
        begrunnelse={begrunnelse}
        dokumentdata={dokumentdata}
      />
      {kanResultatForhåndsvises(behandlingResultat) && (
        <VedtakPreviewLink previewCallback={getPreviewAutomatiskBrevCallback(begrunnelse)} />
      )}
    </>
  );

  const brevpanel = skalBrukeOverstyrendeFritekstBrev ? fritekstbrev : automatiskbrev;

  return (
    <div>
      {harTilgjengeligeVedtaksbrev ? (
        brevpanel
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
  [ownProps => ownProps.sprakkode, ownProps => ownProps.dokumentdata],
  (sprakkode, dokumentdata) => ({
    sprakkode,
    begrunnelse: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
    overskrift: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift),
    brødtekst: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst),
  }),
);

const mapStateToPropsFactory = () => {
  return (state, ownProps) => ({
    initialValues: { ...brevselector(ownProps) },
    begrunnelse: formValueSelector(ownProps.parentFormNavn)(state, 'begrunnelse'),
    brødtekst: formValueSelector(ownProps.parentFormNavn)(state, 'brødtekst'),
    overskrift: formValueSelector(ownProps.parentFormNavn)(state, 'overskrift'),
  });
};

export default connect(mapStateToPropsFactory)(injectIntl(BrevPanel));
