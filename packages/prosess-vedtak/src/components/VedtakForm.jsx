import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { clearFields, formPropTypes } from 'redux-form';
import { Formik } from 'formik';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';

import { safeJSONParse } from '@fpsak-frontend/utils';
import { kanHaFritekstbrev, harBareFritekstbrev } from '@fpsak-frontend/utils/src/formidlingUtils';
import vedtakBeregningsresultatPropType from '../propTypes/vedtakBeregningsresultatPropType';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import styles from './vedtakForm.less';
import BrevPanel from './brev/BrevPanel';
import UstrukturerteDokumenter from './UstrukturerteDokumenter';

const isVedtakSubmission = true;

const kanSendesTilGodkjenning = behandlingStatusKode =>
  behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

const formName = 'VedtakForm';

const FORMIK_FIELDNAME = {
  SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV: 'skalBrukeOverstyrendeFritekstBrev',
  SKAL_HINDRE_UTSENDING_AV_BREV: 'skalHindreUtsendingAvBrev',
};

export const VedtakForm = ({
  intl,
  readOnly,
  behandlingStatusKode,
  behandlingresultat,
  aksjonspunkter,
  behandlingPaaVent,
  antallBarn,
  previewCallback,
  aksjonspunktKoder,
  sprakkode,
  skalBrukeOverstyrendeFritekstBrev,
  ytelseTypeKode,
  resultatstruktur,
  alleKodeverk,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  tilbakekrevingvalg,
  simuleringResultat,
  vilkar,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovVedtaksbrev,
  dokumentdata,
  brødtekst,
  overskrift,
  begrunnelse,
  overstyrtMottaker,
  KONTINUERLIG_TILSYN,
  OMSORGEN_FOR,
  VILKAR_FOR_TO,
  UNNTAK_FRA_TILSYNSORDNING,
  BEREGNING_25_PROSENT_AVVIK,
  OVER_18_AAR,
  REVURDERING_ENDRING,
  fritekstdokumenter,
  lagreDokumentdata,
  overlappendeYtelser,
  ...formProps
}) => {
  const overstyrBrevRef = useRef(null);
  const hindreUtsendingRef = useRef(null);
  const onToggleOverstyring = (e, setFieldValue) => {
    const kommendeVerdi = e.target.checked;
    setFieldValue(FORMIK_FIELDNAME.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, e.target.checked);

    if (kommendeVerdi) {
      setFieldValue(FORMIK_FIELDNAME.SKAL_HINDRE_UTSENDING_AV_BREV, false);
      hindreUtsendingRef.current.checked = !kommendeVerdi;
    }
  };

  const onToggleHindreUtsending = (e, setFieldValue) => {
    const kommendeVerdi = e.target.checked;
    setFieldValue(FORMIK_FIELDNAME.SKAL_HINDRE_UTSENDING_AV_BREV, kommendeVerdi);

    if (kommendeVerdi) {
      setFieldValue(FORMIK_FIELDNAME.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, false);
      overstyrBrevRef.current.checked = !kommendeVerdi;
    }
  };

  const informasjonsbehovValues = {
    KONTINUERLIG_TILSYN,
    OMSORGEN_FOR,
    VILKAR_FOR_TO,
    UNNTAK_FRA_TILSYNSORDNING,
    BEREGNING_25_PROSENT_AVVIK,
    OVER_18_AAR,
    REVURDERING_ENDRING,
  };

  return (
    <>
      <Formik
        initialValues={{
          [FORMIK_FIELDNAME.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]: false,
          [FORMIK_FIELDNAME.SKAL_HINDRE_UTSENDING_AV_BREV]: false,
        }}
      >
        {({ values, setFieldValue }) => (
          <VedtakAksjonspunktPanel
            behandlingStatusKode={behandlingStatusKode}
            aksjonspunktKoder={aksjonspunktKoder}
            readOnly={readOnly}
            overlappendeYtelser={overlappendeYtelser}
            alleKodeverk={alleKodeverk}
          >
            <CheckboxGroup className={styles.knappContainer} size="small">
              {kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && (
                <Checkbox
                  value={values.skalBrukeOverstyrendeFritekstBrev}
                  onChange={e => onToggleOverstyring(e, setFieldValue)}
                  disabled={readOnly || harBareFritekstbrev(tilgjengeligeVedtaksbrev)}
                  ref={overstyrBrevRef}
                >
                  {intl.formatMessage({ id: 'VedtakForm.ManuellOverstyring' })}
                </Checkbox>
              )}
              {(ytelseTypeKode === fagsakYtelseType.FRISINN || ytelseTypeKode === fagsakYtelseType.PLEIEPENGER) && (
                <Checkbox
                  onChange={e => onToggleHindreUtsending(e, setFieldValue)}
                  value={values.skalHindreUtsendingAvBrev}
                  disabled={readOnly}
                  ref={hindreUtsendingRef}
                >
                  {intl.formatMessage({ id: 'VedtakForm.HindreUtsending' })}
                </Checkbox>
              )}
            </CheckboxGroup>

            {fritekstdokumenter?.length > 0 && <UstrukturerteDokumenter fritekstdokumenter={fritekstdokumenter} />}

            {(isInnvilget(behandlingresultat.type.kode) || isDelvisInnvilget(behandlingresultat.type.kode)) && (
              <VedtakInnvilgetPanel
                intl={intl}
                antallBarn={antallBarn}
                behandlingsresultat={behandlingresultat}
                readOnly={readOnly}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                ytelseTypeKode={ytelseTypeKode}
                aksjonspunkter={aksjonspunkter}
                sprakkode={sprakkode}
                beregningResultat={resultatstruktur}
                alleKodeverk={alleKodeverk}
                tilbakekrevingvalg={tilbakekrevingvalg}
              />
            )}

            {isAvslag(behandlingresultat.type.kode) && (
              <VedtakAvslagPanel
                behandlingStatusKode={behandlingStatusKode}
                aksjonspunkter={aksjonspunkter}
                behandlingsresultat={behandlingresultat}
                readOnly={readOnly}
                ytelseTypeKode={ytelseTypeKode}
                sprakkode={sprakkode}
                alleKodeverk={alleKodeverk}
                tilbakekrevingvalg={tilbakekrevingvalg}
                simuleringResultat={simuleringResultat}
                vilkar={vilkar}
              />
            )}

            <BrevPanel
              intl={intl}
              readOnly={readOnly}
              sprakkode={sprakkode}
              ytelseTypeKode={ytelseTypeKode}
              personopplysninger={personopplysninger}
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              dokumentdata={dokumentdata}
              tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
              informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
              informasjonsbehovValues={informasjonsbehovValues}
              skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
              previewCallback={previewCallback}
              formProps={formProps}
              brødtekst={brødtekst}
              overskrift={overskrift}
              begrunnelse={begrunnelse}
              overstyrtMottaker={overstyrtMottaker}
              lagreDokumentdata={lagreDokumentdata}
            />
            {kanSendesTilGodkjenning(behandlingStatusKode) && (
              <Row>
                <Column xs="12">
                  {!readOnly && (
                    <Hovedknapp
                      mini
                      className={styles.mainButton}
                      onClick={formProps.handleSubmit}
                      disabled={behandlingPaaVent || formProps.submitting}
                      spinner={formProps.submitting}
                    >
                      {intl.formatMessage({
                        id:
                          aksjonspunkter &&
                          aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
                            ? 'VedtakForm.TilGodkjenning'
                            : 'VedtakForm.FattVedtak',
                      })}
                    </Hovedknapp>
                  )}
                </Column>
              </Row>
            )}
          </VedtakAksjonspunktPanel>
        )}
      </Formik>
    </>
  );
};

VedtakForm.propTypes = {
  resultatstruktur: vedtakBeregningsresultatPropType,
  intl: PropTypes.shape().isRequired,
  antallBarn: PropTypes.number,
  behandlingStatusKode: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  sprakkode: kodeverkObjektPropType.isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  informasjonsbehovVedtaksbrev: PropTypes.shape({
    informasjonsbehov: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  }),
  dokumentdata: PropTypes.shape(),
  KONTINUERLIG_TILSYN: PropTypes.string,
  OMSORGEN_FOR: PropTypes.string,
  VILKAR_FOR_TO: PropTypes.string,
  UNNTAK_FRA_TILSYNSORDNING: PropTypes.string,
  BEREGNING_25_PROSENT_AVVIK: PropTypes.string,
  OVER_18_AAR: PropTypes.string,
  REVURDERING_ENDRING: PropTypes.string,
  fritekstdokumenter: PropTypes.arrayOf(PropTypes.shape()),
  ...formPropTypes,
};

VedtakForm.defaultProps = {
  skalBrukeOverstyrendeFritekstBrev: false,
};

export const getAksjonspunktKoder = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  aksjonspunkter.map(ap => ap.definisjon.kode),
);

const onSubmitPayload = (values, tilgjengeligeVedtaksbrev) =>
  values.aksjonspunktKoder.map(apCode => ({
    kode: apCode,
    begrunnelse: values.begrunnelse,
    overstyrtMottaker: safeJSONParse(values.overstyrtMottaker),
    fritekstbrev: {
      brødtekst: values.brødtekst,
      overskrift: values.overskrift,
    },
    skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
    skalUndertrykkeBrev: values.skalUndertrykkeBrev,
    isVedtakSubmission,
    tilgjengeligeVedtaksbrev,
  }));

const onSubmitPayloadMedEkstraInformasjon = (values, informasjonsbehov, tilgjengeligeVedtaksbrev) => {
  const begrunnelser = informasjonsbehov.map(({ kode }) => ({ kode, begrunnelse: values[kode] }));
  return values.aksjonspunktKoder.map(apCode => ({
    kode: apCode,
    overstyrtMottaker: safeJSONParse(values.overstyrtMottaker),
    fritekstbrev: {
      brødtekst: values.brødtekst,
      overskrift: values.overskrift,
    },
    skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
    skalUndertrykkeBrev: values.skalUndertrykkeBrev,
    isVedtakSubmission,
    begrunnelserMedInformasjonsbehov: begrunnelser,
    tilgjengeligeVedtaksbrev,
  }));
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

const harPotensieltFlereInformasjonsbehov = informasjonsbehovVedtaksbrev => {
  if (informasjonsbehovVedtaksbrev) {
    const { informasjonsbehov } = informasjonsbehovVedtaksbrev;
    return informasjonsbehov.length > 0;
  }
  return false;
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => {
    const { informasjonsbehovVedtaksbrev, submitCallback } = initialOwnProps;
    if (harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)) {
      const transformedValuesForFlereInformasjonsbehov = onSubmitPayloadMedEkstraInformasjon(
        values,
        informasjonsbehovVedtaksbrev.informasjonsbehov,
        initialOwnProps.tilgjengeligeVedtaksbrev,
      );
      return submitCallback(transformedValuesForFlereInformasjonsbehov);
    }
    const transformedValues = onSubmitPayload(values, initialOwnProps.tilgjengeligeVedtaksbrev);
    return submitCallback(transformedValues);
  };
  return (state, ownProps) => {
    const { informasjonsbehovVedtaksbrev } = initialOwnProps;
    const informasjonsbehovFieldNames = [];
    if (harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)) {
      informasjonsbehovVedtaksbrev.informasjonsbehov.forEach(({ kode }) => {
        informasjonsbehovFieldNames.push(kode);
      });
    }

    return {
      onSubmit,
      ...behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
        state,
        'antallBarn',
        'aksjonspunktKoder',
        'skalBrukeOverstyrendeFritekstBrev',
        'skalUndertrykkeBrev',
        'brødtekst',
        'overskrift',
        'begrunnelse',
        'overstyrtMottaker',
        ...informasjonsbehovFieldNames,
      ),
      behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
      behandlingStatusKode: ownProps.behandlingStatus.kode,
      aksjonspunktKoder: getAksjonspunktKoder(ownProps),
      erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  injectIntl(
    behandlingForm({
      form: formName,
    })(VedtakForm),
  ),
);
