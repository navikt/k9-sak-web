import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { Formik, Form } from 'formik';
import { injectIntl } from 'react-intl';
import { Checkbox } from '@navikt/ds-react';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
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
  formProps,
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
              kanKunVelgeFritekstbrev(tilgjengeligeVedtaksbrev) ||
              harMellomlagretFritekstbrev(dokumentdata, vedtakVarsel),
            [fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]:
              readOnly && harOverstyrtMedIngenBrev(dokumentdata, vedtakVarsel),
            [fieldnames.OVERSKRIFT]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift) || '',
            [fieldnames.BRØDTEKST]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst) || '',
            [fieldnames.OVERSTYRT_MOTTAKER]: JSON.stringify(dokumentdata?.[dokumentdatatype.OVERSTYRT_MOTTAKER]),
            [fieldnames.BEGRUNNELSE]: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
          },
          ...mellomlagredeInformasjonsbehov,
        )}
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
              <div className={styles.knappContainer}>
                {kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && (
                  <Checkbox
                    checked={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                    onChange={e => onToggleOverstyring(e, formikProps.setFieldValue)}
                    disabled={readOnly || kanKunVelgeFritekstbrev(tilgjengeligeVedtaksbrev)}
                    value={fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV}
                    size="small"
                  >
                    {intl.formatMessage({ id: 'VedtakForm.ManuellOverstyring' })}
                  </Checkbox>
                )}
                {(ytelseTypeKode === fagsakYtelseType.FRISINN || ytelseTypeKode === fagsakYtelseType.PLEIEPENGER) && (
                  <Checkbox
                    onChange={e => onToggleHindreUtsending(e, formikProps.setFieldValue)}
                    disabled={readOnly}
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
                  formProps={formProps}
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
                begrunnelse={formikProps.values.begrunnelse}
                previewCallback={previewCallback}
                brødtekst={formikProps.values.brødtekst}
                overskrift={formikProps.values.overskrift}
                overstyrtMottaker={formikProps.values.overstyrtMottaker}
                formProps={formikProps}
                dokumentdata={dokumentdata}
                lagreDokumentdata={lagreDokumentdata}
              />
              {!erRevurdering ? (
                <VedtakSubmit
                  behandlingStatusKode={behandlingStatus?.kode}
                  readOnly={readOnly}
                  behandlingPaaVent={behandlingPaaVent}
                  isSubmitting={formikProps.values.isSubmitting}
                  aksjonspunkter={aksjonspunkter}
                />
              ) : (
                <VedtakRevurderingSubmitPanel
                  formProps={formProps}
                  skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                  ytelseTypeKode={ytelseTypeKode}
                  readOnly={readOnly}
                  behandlingStatusKode={behandlingStatus?.kode}
                  harRedusertUtbetaling={harRedusertUtbetaling}
                  visFeilmeldingFordiArsakerMangler={() => setErSendtInnUtenArsaker(true)}
                />
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
  fritekstdokumenter: PropTypes.arrayOf(PropTypes.shape()),
  ...formPropTypes,
};

export default injectIntl(VedtakForm);
