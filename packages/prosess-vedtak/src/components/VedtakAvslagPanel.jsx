import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { findAvslagResultatText, findTilbakekrevingText, hasIkkeOppfyltSoknadsfristvilkar } from './VedtakHelper';
import VedtakFritekstPanel from './VedtakFritekstPanel';
import vedtakVarselPropType from '../propTypes/vedtakVarselPropType';

export const getAvslagArsak = (vilkar, aksjonspunkter, vedtakVarsel, getKodeverknavn) => {
  const avslatteVilkar = vilkar.filter(v =>
    v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT),
  );
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return avslatteVilkar.map(avslåttVilkår => (
    <Normaltekst key={avslåttVilkår.vilkarType.kode}>
      {`${getKodeverknavn(avslåttVilkår.vilkarType)}: ${getKodeverknavn(
        { kode: avslåttVilkår.perioder[0].avslagKode, kodeverk: 'AVSLAGSARSAK' },
        avslåttVilkår.vilkarType.kode,
      )}`}
    </Normaltekst>
  ));
};

export const VedtakAvslagPanelImpl = ({
  intl,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
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
      {getAvslagArsak(vilkar, aksjonspunkter, vedtakVarsel, getKodeverknavn) && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
          {getAvslagArsak(vilkar, aksjonspunkter, vedtakVarsel, getKodeverknavn)}
          <VerticalSpacer sixteenPx />
        </div>
      )}
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
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
