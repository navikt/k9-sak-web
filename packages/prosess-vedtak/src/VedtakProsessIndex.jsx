import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import VedtakPanelsOld from './old/components/VedtakPanels';
import VedtakPanelsNew from './components/VedtakPanels';
import messages from '../i18n/nb_NO.json';
import vedtakBehandlingPropType from './propTypes/vedtakBehandlingPropType';
import vedtakBeregningsresultatPropType from './propTypes/vedtakBeregningsresultatPropType';
import vedtakAksjonspunkterPropType from './propTypes/vedtakAksjonspunkterPropType';
import vedtakSimuleringResultatPropType from './propTypes/vedtakSimuleringResultatPropType';
import vedtakMedlemskapPropType from './propTypes/vedtakMedlemskapPropType';
import vedtakVilkarPropType from './propTypes/vedtakVilkarPropType';
import vedtakTilbakekrevingvalgPropType from './propTypes/vedtakTilbakekrevingvalgPropType';
import vedtakOriginalBehandlingPropType from './propTypes/vedtakOriginalBehandlingPropType';
import vedtakBeregningsgrunnlagPropType from './propTypes/vedtakBeregningsgrunnlagPropType';
import vedtakVarselPropType from './propTypes/vedtakVarselPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const VedtakProsessIndex = ({
  behandling,
  beregningresultatForeldrepenger,
  tilbakekrevingvalg,
  simuleringResultat,
  beregningsgrunnlag,
  vilkar,
  sendVarselOmRevurdering,
  beregningsresultatOriginalBehandling,
  medlemskap,
  aksjonspunkter,
  isReadOnly,
  previewCallback,
  submitCallback,
  ytelseTypeKode,
  employeeHasAccess,
  alleKodeverk,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  vedtakVarsel,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovVedtaksbrev,
  dokumentdataHente,
  fritekstdokumenter,
  lagreDokumentdata,
  overlappendeYtelser,
  featureToggles,
}) => (
  <RawIntlProvider value={intl}>
    {featureToggles?.NY_PROSESS_VEDTAK_ENABLED ? (
      <VedtakPanelsNew
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingTypeKode={behandling.type.kode}
        behandlingStatus={behandling.status}
        sprakkode={behandling.sprakkode}
        behandlingresultat={behandling.behandlingsresultat}
        behandlingPaaVent={behandling.behandlingPaaVent}
        behandlingArsaker={behandling.behandlingÅrsaker}
        beregningsgrunnlag={beregningsgrunnlag}
        vilkar={vilkar}
        tilbakekrevingvalg={tilbakekrevingvalg}
        simuleringResultat={simuleringResultat}
        resultatstruktur={beregningresultatForeldrepenger}
        sendVarselOmRevurdering={sendVarselOmRevurdering}
        resultatstrukturOriginalBehandling={beregningsresultatOriginalBehandling}
        medlemskapFom={medlemskap ? medlemskap.fom : undefined}
        aksjonspunkter={aksjonspunkter}
        ytelseTypeKode={ytelseTypeKode}
        employeeHasAccess={employeeHasAccess}
        readOnly={isReadOnly}
        previewCallback={previewCallback}
        submitCallback={submitCallback}
        alleKodeverk={alleKodeverk}
        personopplysninger={personopplysninger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
        informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
        dokumentdata={dokumentdataHente}
        fritekstdokumenter={fritekstdokumenter}
        lagreDokumentdata={lagreDokumentdata}
        overlappendeYtelser={overlappendeYtelser}
      />
    ) : (
      <VedtakPanelsOld
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingTypeKode={behandling.type.kode}
        behandlingStatus={behandling.status}
        sprakkode={behandling.sprakkode}
        behandlingresultat={behandling.behandlingsresultat}
        behandlingPaaVent={behandling.behandlingPaaVent}
        behandlingArsaker={behandling.behandlingÅrsaker}
        beregningsgrunnlag={beregningsgrunnlag}
        vilkar={vilkar}
        tilbakekrevingvalg={tilbakekrevingvalg}
        simuleringResultat={simuleringResultat}
        resultatstruktur={beregningresultatForeldrepenger}
        sendVarselOmRevurdering={sendVarselOmRevurdering}
        resultatstrukturOriginalBehandling={beregningsresultatOriginalBehandling}
        medlemskapFom={medlemskap ? medlemskap.fom : undefined}
        aksjonspunkter={aksjonspunkter}
        ytelseTypeKode={ytelseTypeKode}
        employeeHasAccess={employeeHasAccess}
        readOnly={isReadOnly}
        previewCallback={previewCallback}
        submitCallback={submitCallback}
        alleKodeverk={alleKodeverk}
        personopplysninger={personopplysninger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        vedtakVarsel={vedtakVarsel}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
        informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
        dokumentdata={dokumentdataHente}
        fritekstdokumenter={fritekstdokumenter}
        lagreDokumentdata={lagreDokumentdata}
        overlappendeYtelser={overlappendeYtelser}
      />
    )}
  </RawIntlProvider>
);

VedtakProsessIndex.propTypes = {
  behandling: vedtakBehandlingPropType.isRequired,
  beregningresultatForeldrepenger: vedtakBeregningsresultatPropType,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  sendVarselOmRevurdering: PropTypes.bool,
  beregningsresultatOriginalBehandling: vedtakOriginalBehandlingPropType,
  medlemskap: vedtakMedlemskapPropType,
  aksjonspunkter: PropTypes.arrayOf(vedtakAksjonspunkterPropType).isRequired,
  simuleringResultat: vedtakSimuleringResultatPropType,
  tilbakekrevingvalg: vedtakTilbakekrevingvalgPropType,
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(vedtakBeregningsgrunnlagPropType),
  vedtakVarsel: vedtakVarselPropType,
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  informasjonsbehovVedtaksbrev: PropTypes.shape({
    informasjonsbehov: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  }),
  dokumentdataHente: PropTypes.shape(),
  fritekstdokumenter: PropTypes.arrayOf(PropTypes.shape()),
  lagreDokumentdata: PropTypes.func.isRequired,
  overlappendeYtelser: PropTypes.arrayOf(PropTypes.shape()),
  featureToggles: PropTypes.shape(),
};

VedtakProsessIndex.defaultProps = {
  beregningresultatForeldrepenger: undefined,
  beregningsresultatOriginalBehandling: undefined,
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
  sendVarselOmRevurdering: false,
  beregningsgrunnlag: undefined,
  tilgjengeligeVedtaksbrev: undefined,
  informasjonsbehovVedtaksbrev: undefined,
};

export default VedtakProsessIndex;
