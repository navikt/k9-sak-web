import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { injectIntl } from 'react-intl';
import { Checkbox } from '@navikt/ds-react';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';

import { safeJSONParse, decodeHtmlEntity } from '@fpsak-frontend/utils';
import {
  kanHaFritekstbrev,
  kanKunVelge,
  harMellomlagretFritekstbrev,
  harMellomLagretMedIngenBrev,
  kanHindreUtsending,
  kanHaAutomatiskVedtaksbrev,
  filterInformasjonsbehov,
  harPotensieltFlereInformasjonsbehov,
  harMellomlagretRedusertUtbetalingArsak,
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
import vedtakVarselPropType from '../propTypes/vedtakVarselPropType';
import LagreFormikStateLokalt from './LagreFormikStateLokalt';
import { fieldnames } from '../konstanter';

const isVedtakSubmission = true;

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
  resultatstruktur,
  simuleringResultat,
  resultatstrukturOriginalBehandling,
  bgPeriodeMedAvslagsårsak,
  medlemskapFom,
  erRevurdering,
  behandlingArsaker,
}) => {
  const [erSendtInnUtenArsaker, setErSendtInnUtenArsaker] = useState(false);
  const vedtakContext = useContext(VedtakFormContext);
  const onToggleOverstyring = (e, setFieldValue) => {
    const kommendeVerdi = e.target.checked;
    setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, kommendeVerdi);

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
              inkluderKalender: values?.[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING],
            }
          : {},
        skalBrukeOverstyrendeFritekstBrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV],
        skalUndertrykkeBrev: values?.[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
        isVedtakSubmission,
        begrunnelserMedInformasjonsbehov: begrunnelser,
        redusertUtbetalingÅrsaker:
          aksjonspunkt.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT
            ? transformRedusertUtbetalingÅrsaker(values)
            : null,
        tilgjengeligeVedtaksbrev,
      }));
  };

  const payload = values =>
    aksjonspunkter
      .filter(ap => ap.kanLoses)
      .map(aksjonspunkt => {
        const tranformedValues = {
          kode: aksjonspunkt.definisjon.kode,
          begrunnelse: values?.[fieldnames.BEGRUNNELSE],
          overstyrtMottaker: safeJSONParse(values?.[fieldnames.OVERSTYRT_MOTTAKER]),
          fritekstbrev: {
            brødtekst: values?.[fieldnames.BRØDTEKST],
            overskrift: values?.[fieldnames.OVERSKRIFT],
            inkluderKalender: values?.[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING],
          },
          skalBrukeOverstyrendeFritekstBrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV],
          skalUndertrykkeBrev: values?.[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
          isVedtakSubmission,
          tilgjengeligeVedtaksbrev,
        };
        if (aksjonspunkt.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT) {
          tranformedValues.redusertUtbetalingÅrsaker = transformRedusertUtbetalingÅrsaker(values);
        }
        return tranformedValues;
      });

  const createPayload = harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)
    ? values => payloadMedEkstraInformasjon(values)
    : values => payload(values);

  const harRedusertUtbetaling = ytelseTypeKode === fagsakYtelseType.FRISINN;

  const aktiverteInformasjonsbehov = (informasjonsbehovVedtaksbrev?.informasjonsbehov || []).filter(
    ({ type }) => type === 'FRITEKST',
  );

  //
  const harFritekstILokalState =
    vedtakContext?.vedtakFormState?.brødtekst || vedtakContext?.vedtakFormState?.overskrift;
  const mellomlagredeInformasjonsbehov = aktiverteInformasjonsbehov.map(informasjonsbehov => ({
    [informasjonsbehov.kode]: dokumentdata?.[informasjonsbehov.kode] || '',
  }));

  const initialValues = Object.assign(
    {},
    {
      [fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]:
        kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.FRITEKST) ||
        (harMellomlagretFritekstbrev(dokumentdata, vedtakVarsel) && kanHaFritekstbrev(tilgjengeligeVedtaksbrev)) ||
        (harFritekstILokalState && kanHaFritekstbrev(tilgjengeligeVedtaksbrev)) ||
        (kanHaFritekstbrev(tilgjengeligeVedtaksbrev) &&
          !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev) &&
          !harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel)),
      [fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]:
        kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.INGEN) ||
        (harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel) &&
          kanHindreUtsending(tilgjengeligeVedtaksbrev) &&
          !harMellomlagretFritekstbrev(dokumentdata, vedtakVarsel)),
      [fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING]:
        dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.inkluderKalender || false,
      [fieldnames.OVERSKRIFT]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift) || '',
      [fieldnames.BRØDTEKST]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst) || '',
      [fieldnames.OVERSTYRT_MOTTAKER]: JSON.stringify(dokumentdata?.[dokumentdatatype.OVERSTYRT_MOTTAKER]),
      [fieldnames.BEGRUNNELSE]: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
    },
    ...[
      ...mellomlagredeInformasjonsbehov,
      ...Object.values(redusertUtbetalingArsak).map(key => ({
        [key]: harMellomlagretRedusertUtbetalingArsak(key, dokumentdata, vedtakVarsel),
      })),
    ],
  );

  const redusertUtbetalingÅrsaker = formikProps => {
    if (harRedusertUtbetaling) {
      return readOnly
        ? vedtakVarsel?.redusertUtbetalingÅrsaker
        : transformRedusertUtbetalingÅrsaker(formikProps.values);
    }
    return null;
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...vedtakContext?.vedtakFormState }}
      onSubmit={values => {
        submitCallback(createPayload(values));
      }}
    >
      {formikProps => (
        <form>
          <LagreFormikStateLokalt />
          <VedtakAksjonspunktPanel
            behandlingStatusKode={behandlingStatus?.kode}
            aksjonspunktKoder={aksjonspunkter.map(ap => ap.definisjon.kode)}
            readOnly={readOnly}
            overlappendeYtelser={overlappendeYtelser}
            alleKodeverk={alleKodeverk}
            viseFlereSjekkbokserForBrev={
              kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && kanHindreUtsending(tilgjengeligeVedtaksbrev)
            }
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
                {fritekstdokumenter?.length > 0 && <UstrukturerteDokumenter fritekstdokumenter={fritekstdokumenter} />}

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
              redusertUtbetalingÅrsaker={redusertUtbetalingÅrsaker(formikProps)}
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
                inkluderKalender={formikProps.values[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING]}
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
                aksjonspunkter={aksjonspunkter}
              />
            )}
          </VedtakAksjonspunktPanel>
        </form>
      )}
    </Formik>
  );
};

VedtakForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingStatus: PropTypes.shape({ kode: PropTypes.string }),
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  informasjonsbehovVedtaksbrev: PropTypes.shape({
    informasjonsbehov: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  }),
  dokumentdata: PropTypes.shape(),
  fritekstdokumenter: PropTypes.arrayOf(PropTypes.shape()),
  vedtakVarsel: vedtakVarselPropType,
  submitCallback: PropTypes.func,
  lagreDokumentdata: PropTypes.func,
  overlappendeYtelser: PropTypes.arrayOf(PropTypes.shape()),
  resultatstruktur: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  resultatstrukturOriginalBehandling: PropTypes.shape(),
  bgPeriodeMedAvslagsårsak: PropTypes.shape(),
  medlemskapFom: PropTypes.string,
  erRevurdering: PropTypes.bool,
  behandlingArsaker: PropTypes.arrayOf(PropTypes.shape()),
};

export default injectIntl(VedtakForm);
