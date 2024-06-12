import PropTypes from 'prop-types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VedtakPanels from './components/VedtakPanels';
import vedtakAksjonspunkterPropType from './propTypes/vedtakAksjonspunkterPropType';
import vedtakBehandlingPropType from './propTypes/vedtakBehandlingPropType';
import vedtakBeregningsgrunnlagPropType from './propTypes/vedtakBeregningsgrunnlagPropType';
import vedtakBeregningsresultatPropType from './propTypes/vedtakBeregningsresultatPropType';
import vedtakMedlemskapPropType from './propTypes/vedtakMedlemskapPropType';
import vedtakOriginalBehandlingPropType from './propTypes/vedtakOriginalBehandlingPropType';
import vedtakSimuleringResultatPropType from './propTypes/vedtakSimuleringResultatPropType';
import vedtakTilbakekrevingvalgPropType from './propTypes/vedtakTilbakekrevingvalgPropType';
import vedtakVarselPropType from './propTypes/vedtakVarselPropType';
import vedtakVilkarPropType from './propTypes/vedtakVilkarPropType';

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
  sendVarselOmRevurdering = false,
  beregningsresultatOriginalBehandling,
  medlemskap,
  aksjonspunkter,
  isReadOnly,
  previewCallback,
  hentFritekstbrevHtmlCallback,
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
}) => (
  <RawIntlProvider value={intl}>
    <VedtakPanels
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingTypeKode={behandling.type}
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
      hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
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
  hentFritekstbrevHtmlCallback: PropTypes.func.isRequired,
};

export default VedtakProsessIndex;
