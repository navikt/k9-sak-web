import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import vedtakVarselPropType from '../propTypes/vedtakVarselPropType';
import AvslagsårsakListe from './AvslagsårsakListe';
import VedtakFritekstPanel from './VedtakFritekstPanel';
import { findAvslagResultatText, findTilbakekrevingText, hasIkkeOppfyltSoknadsfristvilkar } from './VedtakHelper';

export const VedtakAvslagPanelImpl = ({
  intl,
  behandlingStatusKode,
  vilkar,
  behandlingsresultat,
  sprakkode,
  readOnly,
  ytelseTypeKode,
  tilbakekrevingText,
  alleKodeverk,
  beregningErManueltFastsatt,
  vedtakVarsel,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const fritekstfeltForSoknadsfrist =
    behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES &&
    hasIkkeOppfyltSoknadsfristvilkar(vilkar) &&
    ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD;
  const textCode = beregningErManueltFastsatt ? 'VedtakForm.Fritekst.Beregningsgrunnlag' : 'VedtakForm.Fritekst';
  return (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
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
      {(fritekstfeltForSoknadsfrist || vedtakVarsel.avslagsarsakFritekst || beregningErManueltFastsatt) && (
        <VedtakFritekstPanel
          readOnly={readOnly}
          sprakkode={sprakkode}
          vedtakVarsel={vedtakVarsel}
          labelTextCode={textCode}
        />
      )}
    </div>
  );
};

VedtakAvslagPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  tilbakekrevingText: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
  vedtakVarsel: vedtakVarselPropType,
};

VedtakAvslagPanelImpl.defaultProps = {
  tilbakekrevingText: null,
};

const mapStateToProps = (state, ownProps) => ({
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagPanelImpl));
