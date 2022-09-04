import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { decodeHtmlEntity, safeJSONParse } from '@fpsak-frontend/utils';
import {
  filterInformasjonsbehov,
  harMellomlagretFritekstbrev,
  harMellomLagretMedIngenBrev,
  harMellomlagretRedusertUtbetalingArsak,
  harPotensieltFlereInformasjonsbehov,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrev,
  kanHindreUtsending,
  kanKunVelge,
  TilgjengeligeVedtaksbrev,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysninger,
  Behandlingsresultat,
  BehandlingStatusType,
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
  Vilkar,
} from '@k9-sak-web/types';
import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import { Checkbox, Label, Modal } from '@navikt/ds-react';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import redusertUtbetalingArsak from '../kodeverk/redusertUtbetalingArsak';
import { fieldnames } from '../konstanter';
import BrevPanel from './brev/BrevPanel';
import LagreFormikStateLokalt from './LagreFormikStateLokalt';
import RevurderingPaneler from './revurdering/RevurderingPaneler';
import VedtakRevurderingSubmitPanel from './revurdering/VedtakRevurderingSubmitPanel';
import SakGårIkkeTilBeslutterModal from './SakGårIkkeTilBeslutterModal';
import UstrukturerteDokumenter, { UstrukturerteDokumenterType } from './UstrukturerteDokumenter';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import styles from './vedtakForm.less';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakSubmit from './VedtakSubmit';

const isVedtakSubmission = true;

const transformRedusertUtbetalingÅrsaker = formikValues =>
  Object.values(redusertUtbetalingArsak).filter(name =>
    Object.keys(formikValues).some(key => key === name && formikValues[key]),
  );

interface Props {
  intl: IntlShape;
  behandlingStatus: BehandlingStatusType;
  aksjonspunkter: Aksjonspunkt[];
  behandlingresultat: Behandlingsresultat;
  behandlingPaaVent: boolean;
  previewCallback: () => void;
  readOnly: boolean;
  sprakkode: Kodeverk;
  ytelseTypeKode: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  personopplysninger: Personopplysninger;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysninger;
  tilbakekrevingvalg: {
    videreBehandling: {
      kode: string;
    };
  };
  vilkar: Vilkar[];
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  informasjonsbehovVedtaksbrev: { informasjonsbehov: { kode: string; type: string }[] };
  dokumentdata: DokumentDataType;
  fritekstdokumenter: UstrukturerteDokumenterType[];
  vedtakVarsel: {
    avslagsarsak: object;
    avslagsarsakFritekst: string;
    id: number;
    overskrift: string;
    fritekstbrev: string;
    skjæringstidspunkt: {
      dato: string;
    };
    redusertUtbetalingÅrsaker: object[];
    vedtaksbrev: Kodeverk;
    vedtaksdato: string;
  };
  submitCallback: (object: any) => void;
  lagreDokumentdata: LagreDokumentdataType;
  overlappendeYtelser: object[];
  resultatstruktur: string;
  simuleringResultat: object;
  resultatstrukturOriginalBehandling: object;
  bgPeriodeMedAvslagsårsak: object;
  medlemskapFom: string;
  erRevurdering: boolean;
  behandlingArsaker: object[];
}

export const VedtakForm: React.FC<Props> = ({
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
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);
  const [erSendtInnUtenArsaker, setErSendtInnUtenArsaker] = useState(false);
  const [harVurdertOverlappendeYtelse, setHarVurdertOverlappendeYtelse] = useState(false);
  const [visSakGårIkkeTilBeslutterModal, setVisSakGårIkkeTilBeslutterModal] = useState(false);
  const måVurdereOverlappendeYtelse = aksjonspunkter.some(
    aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK,
  );
  const vedtakContext = useContext(VedtakFormContext);
  const onToggleOverstyring = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, isChecked);
    if (isChecked) {
      setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, false);
    } else {
      setFieldValue(fieldnames.BRØDTEKST, '');
      setFieldValue(fieldnames.OVERSKRIFT, '');
    }
  };

  const onToggleHindreUtsending = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, isChecked);

    if (isChecked) {
      setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, false);
      setFieldValue(fieldnames.BRØDTEKST, '');
      setFieldValue(fieldnames.OVERSKRIFT, '');
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
          redusertUtbetalingÅrsaker: undefined,
        };
        if (aksjonspunkt.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT) {
          tranformedValues.redusertUtbetalingÅrsaker = transformRedusertUtbetalingÅrsaker(values);
        }
        return tranformedValues;
      });

  const createPayload = values =>
    harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)
      ? payloadMedEkstraInformasjon(values)
      : payload(values);

  const harRedusertUtbetaling = ytelseTypeKode === fagsakYtelseType.FRISINN;

  const aktiverteInformasjonsbehov = (informasjonsbehovVedtaksbrev?.informasjonsbehov || []).filter(
    ({ type }) => type === 'FRITEKST',
  );

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

  const erToTrinn = aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true);

  const handleErToTrinnSubmit = event => {
    event.preventDefault();
    setVisSakGårIkkeTilBeslutterModal(true);
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...vedtakContext?.vedtakFormState }}
      onSubmit={(values, actions) => {
        if ((måVurdereOverlappendeYtelse && harVurdertOverlappendeYtelse) || !måVurdereOverlappendeYtelse) {
          submitCallback(createPayload(values));
        } else {
          actions.setSubmitting(false);
        }
      }}
    >
      {formikProps => (
        <form className={styles.form}>
          <LagreFormikStateLokalt />
          {(kanHaFritekstbrev(tilgjengeligeVedtaksbrev) || kanHindreUtsending(tilgjengeligeVedtaksbrev)) && (
            <div className={styles.knappContainer}>
              <fieldset>
                <Label size="small" as="legend">
                  Valg for brev
                </Label>
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
                    size="medium"
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
                    size="medium"
                  >
                    {intl.formatMessage({ id: 'VedtakForm.HindreUtsending' })}
                  </Checkbox>
                )}
              </fieldset>
            </div>
          )}
          <div className={styles.aksjonspunktContainer}>
            <VedtakAksjonspunktPanel
              behandlingStatusKode={behandlingStatus?.kode}
              aksjonspunktKoder={aksjonspunkter.map(ap => ap.definisjon.kode)}
              readOnly={readOnly}
              overlappendeYtelser={overlappendeYtelser}
              alleKodeverk={alleKodeverk}
              viseFlereSjekkbokserForBrev={
                kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && kanHindreUtsending(tilgjengeligeVedtaksbrev)
              }
              harVurdertOverlappendeYtelse={harVurdertOverlappendeYtelse}
              setHarVurdertOverlappendeYtelse={setHarVurdertOverlappendeYtelse}
            >
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
                  handleSubmit={erToTrinn ? formikProps.handleSubmit : handleErToTrinnSubmit}
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
                  handleSubmit={erToTrinn ? formikProps.handleSubmit : () => setVisSakGårIkkeTilBeslutterModal(true)}
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
              {visSakGårIkkeTilBeslutterModal && (
                <SakGårIkkeTilBeslutterModal
                  onClose={() => setVisSakGårIkkeTilBeslutterModal(false)}
                  onSubmit={() => {
                    formikProps.handleSubmit();
                    setVisSakGårIkkeTilBeslutterModal(false);
                  }}
                />
              )}
            </VedtakAksjonspunktPanel>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default injectIntl(VedtakForm);
