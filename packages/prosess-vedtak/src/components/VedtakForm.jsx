import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { Formik } from 'formik';
import { injectIntl } from 'react-intl';
import { Checkbox } from '@navikt/ds-react';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { dokumentdatatype } from '@k9-sak-web/konstanter';

import { safeJSONParse, decodeHtmlEntity } from '@fpsak-frontend/utils';
import {
  kanHaFritekstbrev,
  kanKunVelge,
  harMellomlagretFritekstbrev,
  harMellomLagretMedIngenBrev,
  kanHindreUtsending,
  kanHaAutomatiskVedtaksbrev,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import styles from './vedtakForm.less';
import BrevPanel from './brev/BrevPanel';
import UstrukturerteDokumenter from './UstrukturerteDokumenter';
import RevurderingPaneler from './revurdering/RevurderingPaneler';
import redusertUtbetalingArsak from '../kodeverk/redusertUtbetalingArsak';
import VedtakRevurderingSubmitPanel from './revurdering/VedtakRevurderingSubmitPanel';
import VedtakSubmit from './VedtakSubmit';

const isVedtakSubmission = true;

const fieldnames = {
  SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV: 'skalBrukeOverstyrendeFritekstBrev',
  SKAL_HINDRE_UTSENDING_AV_BREV: 'skalHindreUtsendingAvBrev',
  OVERSKRIFT: 'overskrift',
  BRØDTEKST: 'brødtekst',
  OVERSTYRT_MOTTAKER: 'overstyrtMottaker',
  BEGRUNNELSE: 'begrunnelse',
};

const transformRedusertUtbetalingÅrsaker = formikValues =>
  Object.values(redusertUtbetalingArsak).filter(name =>
    Object.keys(formikValues).some(key => key === name && formikValues[key]),
  );

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
  submitCallback,
  fritekstdokumenter,
  lagreDokumentdata,
  overlappendeYtelser,
  revurderingsAarsakString,
  resultatstruktur,
  simuleringResultat,
  resultatstrukturOriginalBehandling,
  bgPeriodeMedAvslagsårsak,
  medlemskapFom,
  erRevurdering,
  behandlingArsaker,
}) => {
  const [erSendtInnUtenArsaker, setErSendtInnUtenArsaker] = useState(false);
  const onToggleOverstyring = (e, setFieldValue) => {
    const kommendeVerdi = e.target.checked;
    setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, e.target.checked);

    if (kommendeVerdi) {
      setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, false);
    }
  };

  const onToggleHindreUtsending = (e, setFieldValue) => {
    const kommendeVerdi = e.target.checked;
    setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, kommendeVerdi);

    if (kommendeVerdi) {
      setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, false);
    }
  };

  const harPotensieltFlereInformasjonsbehov = infobehovVedtaksbrev => {
    if (infobehovVedtaksbrev) {
      const { informasjonsbehov } = infobehovVedtaksbrev;
      return informasjonsbehov.length > 0;
    }
    return false;
  };

  const payloadMedEkstraInformasjon = values => {
    const begrunnelser = informasjonsbehovVedtaksbrev?.informasjonsbehov.map(({ kode }) => ({
      kode,
      begrunnelse: values[kode],
    }));
    return aksjonspunkter
      .filter(ap => ap.kanLoses)
      .map(aksjonspunkt => ({
        kode: aksjonspunkt.definisjon.kode,
        overstyrtMottaker: safeJSONParse(values?.[fieldnames.OVERSTYRT_MOTTAKER]),
        fritekstbrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]
          ? {
              brødtekst: values?.[fieldnames.BRØDTEKST],
              overskrift: values?.[fieldnames.OVERSKRIFT],
            }
          : {},
        skalBrukeOverstyrendeFritekstBrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV],
        skalUndertrykkeBrev: values?.[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
        isVedtakSubmission,
        begrunnelserMedInformasjonsbehov: begrunnelser,
        tilgjengeligeVedtaksbrev,
      }));
  };

  const payload = values =>
    aksjonspunkter
      .filter(ap => ap.kanLoses)
      .map(aksjonspunkt => ({
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
    ? values => payloadMedEkstraInformasjon(values)
    : values => payload(values);

  const filterInformasjonsbehov = (formikValues, aktiverteInformasjonsbehov) => {
    const aktiveVerdier = [];
    const keys = Object.keys(formikValues);

    keys.forEach(key => {
      if (aktiverteInformasjonsbehov.some(informasjonsbehov => informasjonsbehov.kode === key))
        aktiveVerdier.push({ [key]: formikValues[key] });
    });
    return aktiveVerdier;
  };

  const harRedusertUtbetaling = ytelseTypeKode === fagsakYtelseType.FRISINN;
  const aktiverteInformasjonsbehov =
    (informasjonsbehovVedtaksbrev?.informasjonsbehov || []).filter(({ type }) => type === 'FRITEKST') ?? [];
  const mellomlagredeInformasjonsbehov = aktiverteInformasjonsbehov.map(informasjonsbehov => ({
    [informasjonsbehov.kode]: dokumentdata?.[informasjonsbehov.kode] || '',
  }));
  return (
    <>
      <Formik
        initialValues={Object.assign(
          {},
          {
            [fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]:
              kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.AUTOMATISK) ||
              harMellomlagretFritekstbrev(dokumentdata, vedtakVarsel) ||
              (kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev)),
            [fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]:
              kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.INGEN) ||
              (readOnly && harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel)),
            [fieldnames.OVERSKRIFT]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift) || '',
            [fieldnames.BRØDTEKST]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst) || '',
            [fieldnames.OVERSTYRT_MOTTAKER]: JSON.stringify(dokumentdata?.[dokumentdatatype.OVERSTYRT_MOTTAKER]),
            [fieldnames.BEGRUNNELSE]: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
          },
          ...[
            ...mellomlagredeInformasjonsbehov,
            ...Object.values(redusertUtbetalingArsak).map(key => ({ [key]: undefined })),
          ],
        )}
        onSubmit={values => {
          submitCallback(createPayload(values));
        }}
      >
        {formikProps => (
          <form>
            <VedtakAksjonspunktPanel
              behandlingStatusKode={behandlingStatus?.kode}
              aksjonspunktKoder={aksjonspunkter.map(ap => ap.definisjon.kode)}
              readOnly={readOnly}
              overlappendeYtelser={overlappendeYtelser}
              alleKodeverk={alleKodeverk}
            >
              <div className={styles.knappContainer}>
                {kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && (
                  <Checkbox
                    checked={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                    onChange={e => onToggleOverstyring(e, formikProps.setFieldValue)}
                    disabled={
                      readOnly ||
                      kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.FRITEKST) ||
                      (formikProps.values.skalBrukeOverstyrendeFritekstBrev &&
                        !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev))
                    }
                    value={fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV}
                    size="small"
                  >
                    {intl.formatMessage({ id: 'VedtakForm.ManuellOverstyring' })}
                  </Checkbox>
                )}
                {kanHindreUtsending(tilgjengeligeVedtaksbrev) && (
                  <Checkbox
                    onChange={e => onToggleHindreUtsending(e, formikProps.setFieldValue)}
                    disabled={
                      readOnly ||
                      kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.INGEN) ||
                      (formikProps.values.skalHindreUtsendingAvBrev &&
                        !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev))
                    }
                    checked={formikProps.values.skalHindreUtsendingAvBrev}
                    value={fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV}
                    size="small"
                  >
                    {intl.formatMessage({ id: 'VedtakForm.HindreUtsending' })}
                  </Checkbox>
                )}
              </div>
              {!erRevurdering ? (
                <>
                  {fritekstdokumenter?.length > 0 && (
                    <UstrukturerteDokumenter fritekstdokumenter={fritekstdokumenter} />
                  )}

                  {(isInnvilget(behandlingresultat.type.kode) || isDelvisInnvilget(behandlingresultat.type.kode)) && (
                    <VedtakInnvilgetPanel
                      intl={intl}
                      behandlingsresultat={behandlingresultat}
                      ytelseTypeKode={ytelseTypeKode}
                      tilbakekrevingvalg={tilbakekrevingvalg}
                      simuleringResultat={simuleringResultat}
                      alleKodeverk={alleKodeverk}
                    />
                  )}

                  {isAvslag(behandlingresultat.type.kode) && (
                    <VedtakAvslagPanel
                      aksjonspunkter={aksjonspunkter}
                      behandlingsresultat={behandlingresultat}
                      ytelseTypeKode={ytelseTypeKode}
                      alleKodeverk={alleKodeverk}
                      tilbakekrevingvalg={tilbakekrevingvalg}
                      simuleringResultat={simuleringResultat}
                      vilkar={vilkar}
                    />
                  )}
                </>
              ) : (
                <RevurderingPaneler
                  ytelseTypeKode={ytelseTypeKode}
                  behandlingresultat={behandlingresultat}
                  revurderingsAarsakString={revurderingsAarsakString}
                  resultatstruktur={resultatstruktur}
                  tilbakekrevingvalg={tilbakekrevingvalg}
                  simuleringResultat={simuleringResultat}
                  alleKodeverk={alleKodeverk}
                  resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
                  bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
                  behandlingStatusKode={behandlingStatus?.kode}
                  vilkar={vilkar}
                  aksjonspunkter={aksjonspunkter}
                  sprakkode={sprakkode}
                  readOnly={readOnly}
                  vedtakVarsel={vedtakVarsel}
                  medlemskapFom={medlemskapFom}
                  harRedusertUtbetaling={harRedusertUtbetaling}
                  redusertUtbetalingArsak={redusertUtbetalingArsak}
                  formikValues={formikProps.values}
                  erSendtInnUtenArsaker={erSendtInnUtenArsaker}
                  dokumentdata={dokumentdata}
                  behandlingArsaker={behandlingArsaker}
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
                informasjonsbehovValues={filterInformasjonsbehov(formikProps.values, aktiverteInformasjonsbehov)}
                skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                redusertUtbetalingÅrsaker={
                  readOnly
                    ? vedtakVarsel?.redusertUtbetalingÅrsaker
                    : transformRedusertUtbetalingÅrsaker(formikProps.values)
                }
                begrunnelse={formikProps.values.begrunnelse}
                previewCallback={previewCallback}
                brødtekst={formikProps.values.brødtekst}
                overskrift={formikProps.values.overskrift}
                overstyrtMottaker={formikProps.values.overstyrtMottaker}
                formikProps={formikProps}
                dokumentdata={dokumentdata}
                lagreDokumentdata={lagreDokumentdata}
                ytelseTypeKode={ytelseTypeKode}
              />
              {!erRevurdering ? (
                <VedtakSubmit
                  behandlingStatusKode={behandlingStatus?.kode}
                  readOnly={readOnly}
                  behandlingPaaVent={behandlingPaaVent}
                  isSubmitting={formikProps.isSubmitting}
                  aksjonspunkter={aksjonspunkter}
                  handleSubmit={formikProps.handleSubmit}
                  dokumentdata={dokumentdata}
                  lagreDokumentdata={lagreDokumentdata}
                  brødtekst={formikProps.values.brødtekst}
                  overskrift={formikProps.values.overskrift}
                />
              ) : (
                <VedtakRevurderingSubmitPanel
                  formikValues={formikProps.values}
                  isSubmitting={formikProps.isSubmitting}
                  skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                  handleSubmit={formikProps.handleSubmit}
                  ytelseTypeKode={ytelseTypeKode}
                  readOnly={readOnly}
                  behandlingStatusKode={behandlingStatus?.kode}
                  harRedusertUtbetaling={harRedusertUtbetaling}
                  dokumentdata={dokumentdata}
                  lagreDokumentdata={lagreDokumentdata}
                  brødtekst={formikProps.values.brødtekst}
                  overskrift={formikProps.values.overskrift}
                  visFeilmeldingFordiArsakerMangler={() => setErSendtInnUtenArsaker(true)}
                />
              )}
            </VedtakAksjonspunktPanel>
          </form>
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
  fritekstdokumenter: PropTypes.arrayOf(PropTypes.shape()),
  ...formPropTypes,
};

export default injectIntl(VedtakForm);
