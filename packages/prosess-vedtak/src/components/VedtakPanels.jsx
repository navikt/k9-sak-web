import React from 'react';
import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vedtakAksjonspunkterPropType from '../propTypes/vedtakAksjonspunkterPropType';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import vedtakBeregningsresultatPropType from '../propTypes/vedtakBeregningsresultatPropType';
import VedtakForm from './VedtakForm';
import VedtakRevurderingForm from './revurdering/VedtakRevurderingForm';
import {
  skalSkriveFritekstGrunnetFastsettingAvBeregning,
  finnSistePeriodeMedAvslagsårsakBeregning,
} from './VedtakHelper';
import vedtakBeregningsgrunnlagPropType from '../propTypes/vedtakBeregningsgrunnlagPropType';
import vedtakVarselPropType from '../propTypes/vedtakVarselPropType';

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
const VedtakPanels = ({
  readOnly,
  previewCallback,
  submitCallback,
  behandlingTypeKode,
  behandlingId,
  behandlingVersjon,
  behandlingresultat,
  sprakkode,
  behandlingStatus,
  behandlingPaaVent,
  behandlingArsaker,
  tilbakekrevingvalg,
  simuleringResultat,
  resultatstruktur,
  medlemskapFom,
  aksjonspunkter,
  ytelseTypeKode,
  employeeHasAccess,
  alleKodeverk,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  vilkar,
  beregningsgrunnlag,
  resultatstrukturOriginalBehandling,
  vedtakVarsel,
  tilgjengeligeVedtaksbrev,
  dokumentdata,
}) => {
  const beregningErManueltFastsatt = skalSkriveFritekstGrunnetFastsettingAvBeregning(
    beregningsgrunnlag,
    aksjonspunkter,
  );
  if (behandlingTypeKode === behandlingType.REVURDERING) {
    const bgYtelsegrunnlag = beregningsgrunnlag?.ytelsesspesifiktGrunnlag;
    let bgPeriodeMedAvslagsårsak;
    if (ytelseTypeKode === fagsakYtelseType.FRISINN && bgYtelsegrunnlag?.avslagsårsakPrPeriode) {
      bgPeriodeMedAvslagsårsak = finnSistePeriodeMedAvslagsårsakBeregning(
        bgYtelsegrunnlag.avslagsårsakPrPeriode,
        beregningsgrunnlag.beregningsgrunnlagPeriode,
      );
    }
    return (
      <VedtakRevurderingForm
        submitCallback={submitCallback}
        previewCallback={previewCallback}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        behandlingresultat={behandlingresultat}
        behandlingStatusKode={behandlingStatus.kode}
        ytelseTypeKode={ytelseTypeKode}
        sprakkode={sprakkode}
        kanOverstyre={employeeHasAccess}
        alleKodeverk={alleKodeverk}
        aksjonspunkter={aksjonspunkter}
        resultatstruktur={resultatstruktur}
        behandlingArsaker={behandlingArsaker}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskapFom={medlemskapFom}
        vilkar={vilkar}
        tilbakekrevingvalg={tilbakekrevingvalg}
        simuleringResultat={simuleringResultat}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
        vedtakVarsel={vedtakVarsel}
        bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
        dokumentdata={dokumentdata}
        personopplysninger={personopplysninger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
    );
  }

  return (
    <VedtakForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      previewCallback={previewCallback}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      behandlingresultat={behandlingresultat}
      behandlingStatus={behandlingStatus}
      sprakkode={sprakkode}
      behandlingPaaVent={behandlingPaaVent}
      tilbakekrevingvalg={tilbakekrevingvalg}
      simuleringResultat={simuleringResultat}
      resultatstruktur={resultatstruktur}
      behandlingArsaker={behandlingArsaker}
      aksjonspunkter={aksjonspunkter}
      ytelseTypeKode={ytelseTypeKode}
      kanOverstyre={employeeHasAccess}
      alleKodeverk={alleKodeverk}
      personopplysninger={personopplysninger}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      vilkar={vilkar}
      beregningErManueltFastsatt={beregningErManueltFastsatt}
      vedtakVarsel={vedtakVarsel}
      tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      dokumentdata={dokumentdata}
    />
  );
};

VedtakPanels.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  behandlingArsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  resultatstruktur: vedtakBeregningsresultatPropType,
  medlemskapFom: PropTypes.string,
  aksjonspunkter: PropTypes.arrayOf(vedtakAksjonspunkterPropType).isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  resultatstrukturOriginalBehandling: vedtakBeregningsresultatPropType,
  readOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
  beregningsgrunnlag: vedtakBeregningsgrunnlagPropType,
  vedtakVarsel: vedtakVarselPropType,
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  dokumentdata: PropTypes.shape(),
};

VedtakPanels.defaultProps = {
  tilbakekrevingvalg: undefined,
  simuleringResultat: undefined,
  resultatstruktur: undefined,
};

export default VedtakPanels;
