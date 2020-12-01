import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

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
  skalBrukeOverstyrendeFritekstBrev,
  ytelseTypeKode,
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
            id:
              skalBrukeOverstyrendeFritekstBrev && ytelseTypeKode !== fagsakYtelseType.FRISINN
                ? 'VedtakForm.TilGodkjenning'
                : submitKnappTextId,
          })}
        </Hovedknapp>
      )}
    </div>
  );
};

VedtakRevurderingSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  submitKnappTextId: PropTypes.string.isRequired,
  harRedusertUtbetaling: PropTypes.bool.isRequired,
  visFeilmeldingFordiArsakerMangler: PropTypes.func.isRequired,
};

VedtakRevurderingSubmitPanelImpl.defaultProps = {
  skalBrukeOverstyrendeFritekstBrev: undefined,
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
