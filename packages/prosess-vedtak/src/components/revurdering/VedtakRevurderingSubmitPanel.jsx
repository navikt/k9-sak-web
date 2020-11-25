import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import dokumentMalType from "@fpsak-frontend/kodeverk/src/dokumentMalType";

import { ForhaandsvisningsKnapp } from '../VedtakForm';
import styles from '../vedtakForm.less';
import redusertUtbetalingArsak from "../../kodeverk/redusertUtbetalingArsak";

const getPreviewCallback = (formProps, begrunnelse, previewCallback) => e => {
  if (formProps.valid || formProps.pristine) {
    previewCallback({
      dokumentdata: { fritekst: begrunnelse },
      dokumentMal: dokumentMalType.UTLED,
    });
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const getPreviewManueltBrevCallback = (
  formProps,
  begrunnelse,
  brodtekst,
  overskrift,
  skalOverstyre,
  previewCallback,
) => e => {
  if (formProps.valid || formProps.pristine) {
    const data = skalOverstyre ?
      {
        dokumentdata: { fritekstbrev: { brødtekst: brodtekst, overskrift } },
        dokumentMal: dokumentMalType.FRITKS,
      } :
      {
        dokumentdata: { fritekst: begrunnelse },
        dokumentMal: dokumentMalType.UTLED,
      }

    previewCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const harTilkjentYtelseEndretSeg = (revResultat, orgResultat) => {
  if ((!revResultat && orgResultat) || (revResultat && !orgResultat)) {
    return true;
  }
  if (!revResultat) {
    return false;
  }
  return revResultat.beregnetTilkjentYtelse !== orgResultat.beregnetTilkjentYtelse;
};

const skalViseESBrev = (revResultat, orgResultat, erSendtVarsel) => {
  if (harTilkjentYtelseEndretSeg(revResultat, orgResultat)) {
    return true;
  }
  return erSendtVarsel;
};

const skalKunneForhåndsviseBrev = behandlingResultat => {
  if (!behandlingResultat) {
    return true;
  }
  const { type } = behandlingResultat;
  if (!type) {
    return true;
  }
  return type.kode !== 'ENDRING_I_FORDELING_AV_YTELSEN' && type.kode !== 'INGEN_ENDRING';
};

export const getSubmitKnappTekst = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
    ? 'VedtakForm.TilGodkjenning'
    : 'VedtakForm.FattVedtak',
);

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  beregningResultat,
  previewCallback,
  formProps,
  haveSentVarsel,
  originaltBeregningResultat,
  skalBrukeOverstyrendeFritekstBrev,
  ytelseTypeKode,
  readOnly,
  erBehandlingEtterKlage,
  submitKnappTextId,
  begrunnelse,
  brodtekst,
  overskrift,
  behandlingResultat,
  harRedusertUtbetaling,
  visFeilmeldingFordiArsakerMangler
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewCallback);
  const previewOverstyrtBrev = getPreviewManueltBrevCallback(
    formProps,
    begrunnelse,
    brodtekst,
    overskrift,
    true,
    previewCallback,
  );

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
            id: skalBrukeOverstyrendeFritekstBrev && ytelseTypeKode !== fagsakYtelseType.FRISINN
              ? 'VedtakForm.TilGodkjenning'
              : submitKnappTextId,
          })}
        </Hovedknapp>
      )}
      {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD &&
        skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) &&
        skalBrukeOverstyrendeFritekstBrev && <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />}
      {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD &&
        skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) &&
        !skalBrukeOverstyrendeFritekstBrev &&
        !erBehandlingEtterKlage && <ForhaandsvisningsKnapp previewFunction={previewBrev} />}
      {ytelseTypeKode === fagsakYtelseType.PLEIEPENGER && skalBrukeOverstyrendeFritekstBrev && (
        <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
      )}
      {ytelseTypeKode === fagsakYtelseType.PLEIEPENGER &&
        !skalBrukeOverstyrendeFritekstBrev &&
        !erBehandlingEtterKlage &&
        skalKunneForhåndsviseBrev(behandlingResultat) && <ForhaandsvisningsKnapp previewFunction={previewBrev} />}
    </div>
  );
};

VedtakRevurderingSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewCallback: PropTypes.func.isRequired,
  beregningResultat: PropTypes.shape(),
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  originaltBeregningResultat: PropTypes.shape(),
  haveSentVarsel: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  submitKnappTextId: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  brodtekst: PropTypes.string,
  overskrift: PropTypes.string,
  behandlingResultat: PropTypes.shape(),
  harRedusertUtbetaling: PropTypes.bool.isRequired,
  visFeilmeldingFordiArsakerMangler: PropTypes.func.isRequired,
};

VedtakRevurderingSubmitPanelImpl.defaultProps = {
  haveSentVarsel: false,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  skalBrukeOverstyrendeFritekstBrev: undefined,
  begrunnelse: undefined,
  brodtekst: undefined,
  overskrift: undefined,
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
