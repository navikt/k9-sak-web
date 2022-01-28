import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import styles from '../vedtakForm.less';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

export const getSubmitKnappTekst = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
    ? 'VedtakForm.TilGodkjenning'
    : 'VedtakForm.FattVedtak',
);

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  formikProps,
  readOnly,
  submitKnappTextId,
  harRedusertUtbetaling,
  visFeilmeldingFordiArsakerMangler,
  behandlingStatusKode,
  isSubmitting,
}) => {
  const onClick = event =>
    !harRedusertUtbetaling || Object.values(redusertUtbetalingArsak).some(a => !!formikProps.values[a])
      ? formikProps.handleSubmit(event)
      : visFeilmeldingFordiArsakerMangler();

  if (behandlingStatusKode !== behandlingStatusCode.BEHANDLING_UTREDES) {
    return null;
  }

  return (
    <div>
      <div className={styles.margin} />
      {!readOnly && (
        <Hovedknapp mini className={styles.mainButton} onClick={onClick} disabled={isSubmitting} spinner={isSubmitting}>
          {intl.formatMessage({
            id: submitKnappTextId,
          })}
        </Hovedknapp>
      )}
    </div>
  );
};

VedtakRevurderingSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitKnappTextId: PropTypes.string.isRequired,
  harRedusertUtbetaling: PropTypes.bool.isRequired,
  visFeilmeldingFordiArsakerMangler: PropTypes.func.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  formikProps: PropTypes.shape(),
  isSubmitting: PropTypes.bool,
};

const erArsakTypeBehandlingEtterKlage = createSelector(
  [ownProps => ownProps.behandlingArsaker],
  (behandlingArsakTyper = []) =>
    behandlingArsakTyper
      .map(({ behandlingArsakType }) => behandlingArsakType)
      .some(
        bt =>
          bt.kode === klageBehandlingArsakType.ETTER_KLAGE ||
          bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK ||
          bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK,
      ),
);

const mapStateToProps = (state, ownProps) => ({
  submitKnappTextId: getSubmitKnappTekst(ownProps),
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
