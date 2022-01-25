import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { clearFields, formPropTypes } from 'redux-form';
import { Formik, Form } from 'formik';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { dokumentdatatype } from '@k9-sak-web/konstanter';

import { safeJSONParse, decodeHtmlEntity } from '@fpsak-frontend/utils';
import {
  kanHaFritekstbrev,
  kanKunVelgeFritekstbrev,
  harMellomlagretFritekstbrev,
  harOverstyrtMedIngenBrev,
} from '@fpsak-frontend/utils/src/formidlingUtils';
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

const fieldnames = {
  SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV: 'skalBrukeOverstyrendeFritekstBrev',
  SKAL_HINDRE_UTSENDING_AV_BREV: 'skalHindreUtsendingAvBrev',
  OVERSKRIFT: 'overskrift',
  BRØDTEKST: 'brødtekst',
  OVERSTYRT_MOTTAKER: 'overstyrtMottaker',
  BEGRUNNELSE: 'begrunnelse',
};

export const VedtakForm = ({
  intl,
  readOnly,
  behandlingStatus,
  behandlingresultat,
  aksjonspunkter,
  behandlingPaaVent,
  vedtakVarsel,
  previewCallback,
  sprakkode,
  ytelseTypeKode,
  alleKodeverk,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  tilbakekrevingvalg,
  vilkar,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovVedtaksbrev,
  dokumentdata,
  brødtekst,
  overskrift,
  begrunnelse,
  overstyrtMottaker,
  submitCallback,
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
}) => {
  const overstyrBrevRef = useRef(null);
  const hindreUtsendingRef = useRef(null);
  const onToggleOverstyring = (e, setFieldValue) => {
    const kommendeVerdi = e.target.checked;
    setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, e.target.checked);

    if (kommendeVerdi) {
      setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, false);
      hindreUtsendingRef.current.checked = !kommendeVerdi;
    }
  };

  const onToggleHindreUtsending = (e, setFieldValue) => {
    const kommendeVerdi = e.target.checked;
    setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, kommendeVerdi);

    if (kommendeVerdi) {
      setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, false);
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

  const harPotensieltFlereInformasjonsbehov = infobehovVedtaksbrev => {
    if (infobehovVedtaksbrev) {
      const { informasjonsbehov } = infobehovVedtaksbrev;
      return informasjonsbehov.length > 0;
    }
    return false;
  };

  const handleSubmitPayloadMedEkstraInformasjon = values => {
    const begrunnelser = informasjonsbehovVedtaksbrev?.informasjonsbehov.map(({ kode }) => ({
      kode,
      begrunnelse: values[kode],
    }));
    return aksjonspunkter.map(aksjonspunkt => ({
      kode: aksjonspunkt.definisjon.kode,
      overstyrtMottaker: safeJSONParse(values?.[fieldnames.OVERSTYRT_MOTTAKER]),
      fritekstbrev: {
        brødtekst: values?.[fieldnames.BRØDTEKST],
        overskrift: values?.[fieldnames.OVERSKRIFT],
      },
      skalBrukeOverstyrendeFritekstBrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV],
      skalUndertrykkeBrev: values?.[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
      isVedtakSubmission,
      begrunnelserMedInformasjonsbehov: begrunnelser,
      tilgjengeligeVedtaksbrev,
    }));
  };

  const handleSubmitPayload = values =>
    aksjonspunkter.map(aksjonspunkt => ({
      kode: aksjonspunkt.definisjon.kode,
      begrunnelse: values?.[fieldnames.BEGRUNNELSE],
      overstyrtMottaker: safeJSONParse(values?.[fieldnames.OVERSTYRT_MOTTAKER]),
      fritekstbrev: {
        brødtekst: values?.[fieldnames.BRØDTEKST],
        overskrift: values?.[fieldnames.OVERSKRIFT],
      },
      skalBrukeOverstyrendeFritekstBrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV],
      skalUndertrykkeBrev: values?.[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
      isVedtakSubmission,
      tilgjengeligeVedtaksbrev,
    }));

  const createPayload = harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)
    ? values => handleSubmitPayloadMedEkstraInformasjon(values)
    : values => handleSubmitPayload(values);

  return (
    <>
      <Formik
        initialValues={{
          [fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]:
            kanKunVelgeFritekstbrev(tilgjengeligeVedtaksbrev) ||
            harMellomlagretFritekstbrev(dokumentdata, vedtakVarsel),
          [fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]: readOnly && harOverstyrtMedIngenBrev(dokumentdata, vedtakVarsel),
          [fieldnames.OVERSKRIFT]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift) || '',
          [fieldnames.BRØDTEKST]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst) || '',
          [fieldnames.OVERSTYRT_MOTTAKER]: JSON.stringify(dokumentdata?.[dokumentdatatype.OVERSTYRT_MOTTAKER]),
          [fieldnames.BEGRUNNELSE]: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
        }}
        onSubmit={values => {
          submitCallback(createPayload(values));
        }}
      >
        {formikProps => (
          <Form>
            <VedtakAksjonspunktPanel
              behandlingStatusKode={behandlingStatus?.kode}
              aksjonspunktKoder={aksjonspunkter.map(ap => ap.definisjon.kode)}
              readOnly={readOnly}
              overlappendeYtelser={overlappendeYtelser}
              alleKodeverk={alleKodeverk}
            >
              <CheckboxGroup className={styles.knappContainer} size="small">
                {kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && (
                  <Checkbox
                    value={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                    onChange={e => onToggleOverstyring(e, formikProps.setFieldValue)}
                    disabled={readOnly || kanKunVelgeFritekstbrev(tilgjengeligeVedtaksbrev)}
                    ref={overstyrBrevRef}
                  >
                    {intl.formatMessage({ id: 'VedtakForm.ManuellOverstyring' })}
                  </Checkbox>
                )}
                {(ytelseTypeKode === fagsakYtelseType.FRISINN || ytelseTypeKode === fagsakYtelseType.PLEIEPENGER) && (
                  <Checkbox
                    onChange={e => onToggleHindreUtsending(e, formikProps.setFieldValue)}
                    value={formikProps.values.skalHindreUtsendingAvBrev}
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
                  behandlingsresultat={behandlingresultat}
                  ytelseTypeKode={ytelseTypeKode}
                  tilbakekrevingvalg={tilbakekrevingvalg}
                />
              )}

              {isAvslag(behandlingresultat.type.kode) && (
                <VedtakAvslagPanel
                  aksjonspunkter={aksjonspunkter}
                  behandlingsresultat={behandlingresultat}
                  ytelseTypeKode={ytelseTypeKode}
                  alleKodeverk={alleKodeverk}
                  tilbakekrevingvalg={tilbakekrevingvalg}
                  vilkar={vilkar}
                />
              )}

              <BrevPanel
                intl={intl}
                readOnly={readOnly}
                sprakkode={sprakkode}
                personopplysninger={personopplysninger}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
                informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
                informasjonsbehovValues={informasjonsbehovValues}
                skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                begrunnelse={begrunnelse}
                previewCallback={previewCallback}
                brødtekst={brødtekst}
                overskrift={overskrift}
                overstyrtMottaker={overstyrtMottaker}
                formProps={formikProps}
                dokumentdata={dokumentdata}
                lagreDokumentdata={lagreDokumentdata}
              />
              {kanSendesTilGodkjenning(behandlingStatus?.kode) && (
                <Row>
                  <Column xs="12">
                    {!readOnly && (
                      <Hovedknapp
                        mini
                        className={styles.mainButton}
                        disabled={behandlingPaaVent || formikProps.isSubmitting}
                        spinner={formikProps.isSubmitting}
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
          </Form>
        )}
      </Formik>
    </>
  );
};

VedtakForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingStatusKode: PropTypes.shape({ kode: PropTypes.string }),
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
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

export const buildInitialValues = createSelector(
  [
    ownProps => ownProps.behandlingStatus,
    ownProps => ownProps.resultatstruktur,
    ownProps => ownProps.aksjonspunkter,
    ownProps => ownProps.ytelseTypeKode,
    ownProps => ownProps.behandlingresultat,
    ownProps => ownProps.sprakkode,
    ownProps => ownProps.vedtakVarsel,
    ownProps => ownProps.dokumentdata,
    ownProps => ownProps.tilgjengeligeVedtaksbrev,
    ownProps => ownProps.readOnly,
  ],
  (
    status,
    beregningResultat,
    aksjonspunkter,
    ytelseTypeKode,
    behandlingresultat,
    sprakkode,
    vedtakVarsel,
    dokumentdata,
  ) => ({
    KONTINUERLIG_TILSYN: dokumentdata?.KONTINUERLIG_TILSYN,
    OMSORGEN_FOR: dokumentdata?.OMSORGEN_FOR,
    VILKAR_FOR_TO: dokumentdata?.VILKAR_FOR_TO,
    UNNTAK_FRA_TILSYNSORDNING: dokumentdata?.UNNTAK_FRA_TILSYNSORDNING,
    BEREGNING_25_PROSENT_AVVIK: dokumentdata?.BEREGNING_25_PROSENT_AVVIK,
    OVER_18_AAR: dokumentdata?.OVER_18_AAR,
    REVURDERING_ENDRING: dokumentdata?.REVURDERING_ENDRING,
  }),
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
      ...behandlingFormValueSelector(
        formName,
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, ...informasjonsbehovFieldNames),
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
