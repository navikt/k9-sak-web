import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import styles from '../vedtakForm.less';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

export const getSubmitKnappTekst = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
    ? 'VedtakForm.TilGodkjenning'
    : 'VedtakForm.FattVedtak',
);

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  formProps,
  readOnly,
  submitKnappTextId,
  harRedusertUtbetaling,
  visFeilmeldingFordiArsakerMangler,
}) => {
  const onClick = event =>
    !harRedusertUtbetaling || Object.values(redusertUtbetalingArsak).some(a => !!formProps[a])
      ? formProps.handleSubmit(event)
      : visFeilmeldingFordiArsakerMangler();

  return (
    <div>
      <div className={styles.margin} />
      {!readOnly && (
        <Hovedknapp
          mini
          className={styles.mainButton}
          onClick={onClick}
          disabled={formProps.submitting}
          spinner={formProps.submitting}
        >
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
  formProps: PropTypes.shape().isRequired,
  submitKnappTextId: PropTypes.string.isRequired,
  harRedusertUtbetaling: PropTypes.bool.isRequired,
  visFeilmeldingFordiArsakerMangler: PropTypes.func.isRequired,
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
